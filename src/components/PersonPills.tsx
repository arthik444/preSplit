import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Users } from 'lucide-react';
import { useAppStore } from '../store';
import { GroupsModal } from './GroupsModal';

export const PersonPills: React.FC = () => {
    const { people, addPerson, removePerson, recentNames } = useAppStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [showGroupsModal, setShowGroupsModal] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    // Update dropdown position
    useEffect(() => {
        if (isAdding && inputRef.current) {
            const updatePos = () => {
                const rect = inputRef.current?.getBoundingClientRect();
                if (rect) {
                    setDropdownPos({
                        top: rect.bottom + 8,
                        left: rect.left,
                        width: Math.max(rect.width, 192) // Min width 12rem
                    });
                }
            };
            updatePos();
            window.addEventListener('scroll', updatePos, true);
            window.addEventListener('resize', updatePos);
            return () => {
                window.removeEventListener('scroll', updatePos, true);
                window.removeEventListener('resize', updatePos);
            };
        }
    }, [isAdding, newName]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            addPerson(newName.trim());
            setNewName('');
            setIsAdding(false);
        }
    };

    const handleQuickAdd = (name: string) => {
        addPerson(name);
        setNewName('');
    };

    // Filter out names that are already added
    // Filter out names that are already added
    const availableRecentNames = recentNames.filter(
        name => !people.some(p => p.name.toLowerCase() === name.toLowerCase())
    );

    // Filter suggestions based on input
    const filteredSuggestions = availableRecentNames
        .filter(name => name.toLowerCase().includes(newName.toLowerCase()))
        .slice(0, 5);

    return (
        <>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pt-0.5 pb-0.5 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {people.map((person) => (
                    <div
                        key={person.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium text-white shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 animate-in zoom-in"
                        style={{ backgroundColor: person.color }}
                    >
                        <span>{person.name}</span>
                        <button
                            onClick={() => removePerson(person.id)}
                            className="hover:bg-black/20 rounded-full p-0.5 transition-all duration-150 active:scale-90"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {/* Load Group Button */}
                <button
                    onClick={() => setShowGroupsModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 active:scale-95 transition-all duration-200"
                    title="Load saved group"
                >
                    <Users className="w-4 h-4" />
                </button>

                {isAdding ? (
                    <div className="relative flex flex-col gap-2">
                        <form onSubmit={handleAdd} className="flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Name"
                                autoFocus
                                autoCapitalize="words"
                                onBlur={() => {
                                    // Small delay to allow clicks on suggestions to register if onMouseDown doesn't catch it
                                    setTimeout(() => {
                                        if (!newName) setIsAdding(false);
                                    }, 150);
                                }}
                                className="w-32 px-3 py-1.5 rounded-full text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                            />
                        </form>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        {people.length === 0 && <span>Add Person</span>}
                    </button>
                )}
            </div>

            {showGroupsModal && (
                <GroupsModal onClose={() => setShowGroupsModal(false)} />
            )}

            {/* Portal Dropdown */}
            {isAdding && filteredSuggestions.length > 0 && createPortal(
                <div
                    className="fixed bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2"
                    style={{
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width
                    }}
                >
                    <div className="max-h-48 overflow-y-auto">
                        {filteredSuggestions.map(name => (
                            <button
                                key={name}
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent blur
                                    handleQuickAdd(name);
                                }}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50 last:border-0 flex items-center justify-between group"
                            >
                                {name}
                                <Plus className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500" />
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
