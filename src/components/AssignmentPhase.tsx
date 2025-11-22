import React from 'react';
import { useAppStore } from '../store';
import { PersonPills } from './PersonPills';
import { ReceiptItemList } from './ReceiptItemList';
import { ArrowRight, ChevronUp } from 'lucide-react';

export const AssignmentPhase: React.FC = () => {
    const { setPhase, receipt, people, assignAllToAll, clearAllAssignments } = useAppStore();
    const [splitMode, setSplitMode] = React.useState<'manual' | 'equal'>('manual');
    const [highlightedId, setHighlightedId] = React.useState<string | null>(null);

    // Calculate progress
    const totalItems = receipt?.items.length || 0;
    const assignedItems = receipt?.items.filter(i => i.assignedTo.length > 0).length || 0;

    return (
        <div className="flex flex-col h-full relative">
            <div className="p-4 pb-0">


                <PersonPills />

                <div className="flex bg-gray-100 p-1 rounded-lg mb-2">
                    <button
                        onClick={() => {
                            setSplitMode('equal');
                            // If we are switching to Equal, assign all.
                            // We can track local state if needed, but for now just trigger action.
                            assignAllToAll();
                        }}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${splitMode === 'equal'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Split Equally
                    </button>
                    <button
                        onClick={() => {
                            setSplitMode('manual');
                            clearAllAssignments();
                        }}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${splitMode === 'manual'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Manual
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
                <ReceiptItemList highlightedItemId={highlightedId} />
            </div>

            <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
                    <span>{assignedItems} of {totalItems} items assigned</span>
                    <span>${receipt?.subtotal.toFixed(2)} Subtotal</span>
                </div>

                <button
                    onClick={() => {
                        if (people.length === 0) return;

                        if (assignedItems < totalItems) {
                            // Find first unassigned item
                            const firstUnassigned = receipt?.items.find(item => item.assignedTo.length === 0);
                            if (firstUnassigned) {
                                const element = document.getElementById(`item-${firstUnassigned.id}`);
                                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                // Highlight it temporarily
                                setHighlightedId(firstUnassigned.id);
                                setTimeout(() => setHighlightedId(null), 2000);
                            }
                        } else {
                            setPhase('settlement');
                        }
                    }}
                    className={`w-full py-3.5 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${people.length > 0 && assignedItems === totalItems
                        ? 'bg-blue-600 text-white shadow-blue-200 active:scale-[0.98]'
                        : 'bg-gray-200 text-gray-400 cursor-pointer'
                        }`}
                >
                    {assignedItems < totalItems ? (
                        people.length === 0 ? (
                            <span>Add People to Start</span>
                        ) : (
                            <div className="flex items-center justify-between w-full px-4">
                                <span className="text-gray-600 font-medium">
                                    {totalItems - assignedItems} items left
                                </span>
                                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Navigate
                                    <ChevronUp className="w-3 h-3" />
                                </div>
                            </div>
                        )
                    ) : (
                        <>
                            Review & Settle
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

