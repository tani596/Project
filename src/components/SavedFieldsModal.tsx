import React from 'react';
import { useApp } from '../context/AppContext';
import { SavedField } from '../types/advisor';
import {
  X,
  Bookmark,
  Trash2,
  Calendar,
  Layers,
  Droplets,
  ExternalLink,
  MessageSquareQuote,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface SavedFieldsModalProps {
  onLoadField: (field: SavedField) => void;
}

export const SavedFieldsModal: React.FC<SavedFieldsModalProps> = ({ onLoadField }) => {
  const { isMyFieldsOpen, setIsMyFieldsOpen, savedFields, removeSavedField, updateFieldFeedback, user, setIsAuthOpen } = useApp();

  if (!isMyFieldsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-card w-full max-w-3xl rounded-2xl border border-border shadow-2xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">
                My Saved Rice Fields & Advice
              </h3>
              <p className="text-xs text-foreground/70">
                {user.isGuest ? 'Saved locally in this browser' : `Saved to account: ${user.email}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMyFieldsOpen(false)}
            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted-bg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {user.isGuest && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
            <span className="text-foreground/80">
              You are using <strong>Guest Mode</strong>. Fields are saved in your local browser cache.
            </span>
            <button
              onClick={() => {
                setIsMyFieldsOpen(false);
                setIsAuthOpen(true);
              }}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 underline ml-2 shrink-0 cursor-pointer"
            >
              Sign in to sync across devices
            </button>
          </div>
        )}

        {/* Saved List */}
        {savedFields.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Bookmark className="w-8 h-8 text-muted mx-auto" />
            <p className="text-sm font-semibold text-foreground">
              No saved fields yet
            </p>
            <p className="text-xs text-foreground/70 max-w-sm mx-auto">
              Run recommendations on the Advisor Workspace and click &quot;Save Field & Advice&quot; to keep history.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedFields.map((item) => {
              const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-xl border border-border bg-card space-y-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <h4 className="font-display font-bold text-base text-foreground">
                        {item.field_name}
                      </h4>
                      <div className="flex items-center space-x-3 text-xs text-muted mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formattedDate}</span>
                        </span>
                        <span>•</span>
                        <span className="capitalize">{item.inputs.growthStage.replace('_', ' ')}</span>
                        <span>•</span>
                        <span className="capitalize">{item.inputs.waterCondition.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onLoadField(item);
                          setIsMyFieldsOpen(false);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open in Workspace</span>
                      </button>
                      <button
                        onClick={() => removeSavedField(item.id)}
                        className="p-1.5 rounded-lg border border-border text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        title="Delete saved field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Advice summary */}
                  <div className="p-3 rounded-lg bg-muted-bg/50 text-xs space-y-1">
                    <span className="font-semibold text-foreground">Top Priority Given:</span>
                    <p className="text-foreground/80">{item.advice.top_priority}</p>
                  </div>

                  {/* Optional: Season outcome feedback form */}
                  <div className="border border-border/70 rounded-lg p-3 bg-card space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        Season Outcome Feedback (Optional)
                      </span>
                      <span className="text-[10px] text-muted">
                        Stored for future season review only; model does not retrain automatically
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Q1: Followed advice */}
                      <div>
                        <label className="block text-[11px] text-muted font-medium mb-1">
                          Did you follow this advice in the field?
                        </label>
                        <div className="flex items-center space-x-2">
                          {(['yes', 'partly', 'no'] as const).map((opt) => (
                            <button
                              key={opt}
                              onClick={() =>
                                updateFieldFeedback(
                                  item.id,
                                  opt,
                                  item.yield_vs_usual || 'same'
                                )
                              }
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize border cursor-pointer ${
                                item.followed_advice === opt
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-muted-bg text-foreground border-border'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Q2: Yield vs usual */}
                      <div>
                        <label className="block text-[11px] text-muted font-medium mb-1">
                          How was your harvest yield compared to usual?
                        </label>
                        <div className="flex items-center space-x-2">
                          {(['lower', 'same', 'higher'] as const).map((opt) => (
                            <button
                              key={opt}
                              onClick={() =>
                                updateFieldFeedback(
                                  item.id,
                                  item.followed_advice || 'yes',
                                  opt
                                )
                              }
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize border cursor-pointer ${
                                item.yield_vs_usual === opt
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-muted-bg text-foreground border-border'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
