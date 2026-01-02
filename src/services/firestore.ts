import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp,
    updateDoc,
    limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ReceiptData, Person, SavedGroup, UserPreferences } from '../types';

const sanitizeData = (data: any): any => {
    if (data === undefined) return null;
    if (data === null) return null;

    // Handle Firestore Timestamps - don't recurse into them
    if (data && typeof data === 'object' && typeof data.toDate === 'function') {
        return data;
    }

    if (Array.isArray(data)) return data.map(sanitizeData);
    if (typeof data === 'object') {
        const sanitized: any = {};
        Object.keys(data).forEach(key => {
            const val = sanitizeData(data[key]);
            if (val !== undefined) {
                sanitized[key] = val;
            }
        });
        return sanitized;
    }
    return data;
};

export interface SavedReceipt {
    id: string;
    receipt: ReceiptData;
    people: Person[];
    createdAt: Date;
    userId: string;
}

/**
 * Save a receipt to Firestore
 */
export const saveReceipt = async (
    userId: string,
    receipt: ReceiptData,
    people: Person[]
): Promise<string> => {
    try {
        const receiptToSave = {
            ...receipt,
            title: receipt.title || `Receipt ${new Date().toLocaleDateString()}`,
        };

        const receiptsRef = collection(db, 'users', userId, 'receipts');
        const docRef = await addDoc(receiptsRef, sanitizeData({
            receipt: receiptToSave,
            people,
            createdAt: Timestamp.now(),
        }));
        return docRef.id;
    } catch (error) {
        console.error('Error saving receipt:', error);
        throw error;
    }
};

/**
 * Update an existing receipt in Firestore
 */
export const updateReceipt = async (
    userId: string,
    receiptId: string,
    receipt: ReceiptData,
    people: Person[]
): Promise<void> => {
    try {
        const receiptRef = doc(db, 'users', userId, 'receipts', receiptId);
        const receiptToSave = {
            ...receipt,
            title: receipt.title || `Receipt ${new Date().toLocaleDateString()}`,
        };

        await updateDoc(receiptRef, sanitizeData({
            receipt: receiptToSave,
            people,
            // Don't update createdAt
        }));
    } catch (error) {
        console.error('Error updating receipt:', error);
        throw error;
    }
};

/**
 * Load all receipts for a user
 */
export const loadReceipts = async (userId: string): Promise<SavedReceipt[]> => {
    try {
        const receiptsRef = collection(db, 'users', userId, 'receipts');
        const q = query(receiptsRef, orderBy('createdAt', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => {
            const data = doc.data();

            // Handle potentially corrupted or old data format
            let createdAtDate: Date;
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                createdAtDate = data.createdAt.toDate();
            } else if (data.createdAt && data.createdAt.seconds) {
                // If it was accidentally saved as a plain object
                createdAtDate = new Date(data.createdAt.seconds * 1000);
            } else {
                createdAtDate = new Date();
            }

            return {
                id: doc.id,
                receipt: data.receipt as ReceiptData,
                people: data.people as Person[],
                createdAt: createdAtDate,
                userId,
            };
        });
    } catch (error) {
        console.error('Error loading receipts:', error);
        throw error;
    }
};

/**
 * Delete a receipt from Firestore
 */
export const deleteReceipt = async (userId: string, receiptId: string): Promise<void> => {
    try {
        const receiptRef = doc(db, 'users', userId, 'receipts', receiptId);
        await deleteDoc(receiptRef);
    } catch (error) {
        console.error('Error deleting receipt:', error);
        throw error;
    }
};

/**
 * Save a group to Firestore
 */
export const saveGroup = async (
    userId: string,
    name: string,
    people: Person[]
): Promise<string> => {
    try {
        const groupsRef = collection(db, 'users', userId, 'groups');
        const docRef = await addDoc(groupsRef, {
            name,
            people,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving group:', error);
        throw error;
    }
};

/**
 * Load all groups for a user
 */
export const loadGroups = async (userId: string): Promise<SavedGroup[]> => {
    try {
        const groupsRef = collection(db, 'users', userId, 'groups');
        const q = query(groupsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name as string,
                people: data.people as Person[],
                createdAt: data.createdAt.toDate(),
                userId,
            };
        });
    } catch (error) {
        console.error('Error loading groups:', error);
        throw error;
    }
};

/**
 * Update an existing group in Firestore
 */
export const updateGroup = async (
    userId: string,
    groupId: string,
    name: string,
    people: Person[]
): Promise<void> => {
    try {
        const groupRef = doc(db, 'users', userId, 'groups', groupId);
        await updateDoc(groupRef, {
            name,
            people,
        });
    } catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
};

/**
 * Delete a group from Firestore
 */
export const deleteGroup = async (userId: string, groupId: string): Promise<void> => {
    try {
        const groupRef = doc(db, 'users', userId, 'groups', groupId);
        await deleteDoc(groupRef);
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
};

/**
 * Save user preferences to Firestore
 */
export const saveUserPreferences = async (
    userId: string,
    preferences: UserPreferences
): Promise<void> => {
    try {
        const prefsRef = doc(db, 'users', userId, 'preferences', 'settings');
        const sanitizedPrefs = sanitizeData(preferences);
        await updateDoc(prefsRef, sanitizedPrefs).catch(async () => {
            // If document doesn't exist, create it
            const { setDoc } = await import('firebase/firestore');
            await setDoc(prefsRef, sanitizedPrefs);
        });
    } catch (error) {
        console.error('Error saving preferences:', error);
        throw error;
    }
};

/**
 * Load user preferences from Firestore
 */
export const loadUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
    try {
        const { getDoc } = await import('firebase/firestore');
        const prefsRef = doc(db, 'users', userId, 'preferences', 'settings');
        const docSnap = await getDoc(prefsRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserPreferences;
        }
        return null;
    } catch (error) {
        console.error('Error loading preferences:', error);
        return null;
    }
};
