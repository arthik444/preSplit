import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAppStore } from '../store';
import { parseReceiptImage } from '../services/gemini';
import { FinalLogo } from './FinalLogo';

export const CapturePhase: React.FC = () => {
    const { setReceipt, setPhase, user, userPreferences, savedGroups, loadGroup, people } = useAppStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [processingStatus, setProcessingStatus] = useState<string>('');
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [hasAutoLoaded, setHasAutoLoaded] = useState(false);

    // Auto-load default group when component mounts
    useEffect(() => {
        if (user && userPreferences?.defaultGroupId && !hasAutoLoaded && people.length === 0) {
            const defaultGroup = savedGroups.find(g => g.id === userPreferences.defaultGroupId);
            if (defaultGroup) {
                loadGroup(defaultGroup, true); // Silent mode - no confirmation dialog
                setHasAutoLoaded(true);
            }
        }
    }, [user, userPreferences, savedGroups, hasAutoLoaded, people.length, loadGroup]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsProcessing(true);
        setError(null);

        try {
            const fileArray = Array.from(files);
            const allItems: any[] = [];
            let combinedSubtotal = 0;
            let combinedTax = 0;
            let combinedTip = 0;
            let combinedTotal = 0;

            // Process each image
            for (let i = 0; i < fileArray.length; i++) {
                const file = fileArray[i];
                setProcessingStatus(`Processing image ${i + 1} of ${fileArray.length}...`);

                try {
                    const data = await parseReceiptImage(file);

                    // Collect items
                    if (data.items && data.items.length > 0) {
                        allItems.push(...data.items);
                    }

                    // Sum up totals
                    combinedSubtotal += data.subtotal || 0;
                    combinedTax += data.tax || 0;
                    combinedTip += data.tip || 0;
                    combinedTotal += data.total || 0;
                } catch (imageError: any) {
                    console.warn(`Failed to process image ${i + 1}:`, imageError);
                    // Continue processing other images
                }
            }

            // Validate combined data
            if (allItems.length === 0) {
                throw new Error("No items found in any receipt. Please try again.");
            }

            // Check if we have at least some valid prices
            const validItems = allItems.filter(item => typeof item.price === 'number' && !isNaN(item.price));
            if (validItems.length === 0) {
                throw new Error("Could not extract prices. Please try a clearer photo.");
            }

            // Create merged receipt with recalculated subtotal
            const subtotal = allItems.reduce((sum, item) => sum + (item.price || 0), 0);
            const mergedReceipt = {
                items: allItems,
                subtotal: parseFloat(subtotal.toFixed(2)),
                tax: parseFloat(combinedTax.toFixed(2)),
                tip: parseFloat(combinedTip.toFixed(2)),
                total: parseFloat((subtotal + combinedTax + combinedTip).toFixed(2))
            };

            setReceipt(mergedReceipt);
            setPhase('assignment');
        } catch (err: any) {
            setError(err.message || "Failed to process receipt");
        } finally {
            setIsProcessing(false);
            setProcessingStatus('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Hero Section with Logo and Tagline */}
            <div className="pt-8 pb-4 px-4 text-center flex flex-col items-center">
                <FinalLogo size={80} className="mb-4" />
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Scan. Beam. Done.
                </h1>
                <p className="text-base text-slate-500 font-medium">
                    The fastest way to split the bill.
                </p>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-4 pb-6 max-w-md mx-auto w-full">

                {/* Camera Viewfinder Button */}
                <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex-1 w-full relative group overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 transition-all duration-300 active:scale-[0.99] hover:bg-gray-100"
                >
                    {/* Corner Accents (Viewfinder look) */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gray-300 rounded-tl-lg group-hover:border-gray-400 transition-colors" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gray-300 rounded-tr-lg group-hover:border-gray-400 transition-colors" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gray-300 rounded-bl-lg group-hover:border-gray-400 transition-colors" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gray-300 rounded-br-lg group-hover:border-gray-400 transition-colors" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        {isProcessing ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-10 h-10 text-gray-900 animate-spin" />
                                <p className="text-sm font-medium text-gray-500 animate-pulse">
                                    {processingStatus || 'Reading receipt...'}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 transition-transform duration-300 group-hover:scale-105">
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                                    <Camera className="w-7 h-7 text-gray-900" strokeWidth={1.5} />
                                </div>
                                <div className="text-center space-y-0.5">
                                    <h2 className="text-lg font-semibold text-gray-900">Scan Receipt</h2>
                                    <p className="text-sm text-gray-500">Tap to open camera</p>
                                </div>
                            </div>
                        )}
                    </div>
                </button>

                {/* Secondary Action */}
                <div className="mt-4 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider">
                            <span className="bg-white px-4 text-gray-400">or</span>
                        </div>
                    </div>

                    <button
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={isProcessing}
                        className="w-full py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Import from Photos
                    </button>
                </div>

                {/* Hidden Inputs */}
                <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    capture="environment"
                    multiple
                />
                <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    multiple
                />
            </div>

            {/* Error Toast */}
            {error && (
                <div className="absolute bottom-6 left-4 right-4 mx-auto max-w-md">
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center shadow-sm border border-red-100 animate-in slide-in-from-bottom-2">
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
};
