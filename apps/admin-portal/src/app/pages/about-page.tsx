import { useEffect, useState } from 'react';
import { ABOUT_VALUES_KEY, parseAboutValues, settingsApi } from '@dev-team-cv/supabase';
import { DEFAULT_ABOUT_VALUES, type AboutValue } from '@dev-team-cv/shared-types';
import { Button, Input, Textarea } from '@dev-team-cv/ui';
import { FormCard } from '../components/form-card';

const MIN_VALUES = 1;
const MAX_VALUES = 5;

export function AboutPage() {
  const [values, setValues] = useState<AboutValue[]>(DEFAULT_ABOUT_VALUES);
  const [savedValues, setSavedValues] = useState<AboutValue[]>(DEFAULT_ABOUT_VALUES);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const isDirty = JSON.stringify(values) !== JSON.stringify(savedValues);

  useEffect(() => {
    settingsApi.getAll().then((settings) => {
      const parsed = parseAboutValues(settings[ABOUT_VALUES_KEY]);
      setValues(parsed);
      setSavedValues(parsed);
    });
  }, []);

  const updateValue = (index: number, field: keyof AboutValue, value: string) =>
    setValues((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const addValue = () => {
    if (values.length >= MAX_VALUES) return;
    setValues((prev) => [...prev, { title: '', desc: '' }]);
  };

  const removeValue = (index: number) => {
    if (values.length <= MIN_VALUES) return;
    setValues((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedOk(false);
    try {
      await settingsApi.set(ABOUT_VALUES_KEY, JSON.stringify(values));
      setSavedValues(values);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">About Section</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage the values cards shown on the public About section. Statistics are computed automatically from team and project data.
        </p>
      </div>

      <FormCard
        title="Values"
        description={`Shown as interactive cards (${MIN_VALUES}–${MAX_VALUES} items).`}
        action={
          <Button variant="secondary" size="sm" onClick={addValue} disabled={values.length >= MAX_VALUES}>
            + Add Value
          </Button>
        }
        isDirty={isDirty}
        saving={saving}
        savedOk={savedOk}
        onSave={handleSave}
      >
        {values.map((value, index) => (
          <div
            key={index}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3 transition-colors hover:border-[var(--text-muted)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--surface-overlay)] text-[10px] font-semibold text-[var(--text-secondary)]">
                  {index + 1}
                </span>
                Value
              </span>
              <button
                type="button"
                onClick={() => removeValue(index)}
                disabled={values.length <= MIN_VALUES}
                aria-label={`Remove value ${index + 1}`}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
            <Input
              label="Title"
              value={value.title}
              onChange={(e) => updateValue(index, 'title', e.target.value)}
              placeholder="e.g. Craftsmanship"
            />
            <Textarea
              label="Description"
              value={value.desc}
              onChange={(e) => updateValue(index, 'desc', e.target.value)}
              placeholder="Short description of this value"
              rows={3}
            />
          </div>
        ))}
      </FormCard>
    </div>
  );
}
