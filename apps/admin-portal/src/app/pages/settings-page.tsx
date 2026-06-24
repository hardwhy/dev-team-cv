import { useEffect, useState } from 'react';
import { settingsApi } from '@dev-team-cv/supabase';
import { Button, Input, Card } from '@dev-team-cv/ui';

export function SettingsPage() {
  const [teamName, setTeamName] = useState('');
  const [tagline, setTagline] = useState('');
  const [copyrightName, setCopyrightName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsApi.getAll().then((s) => {
      setTeamName(s['team_name'] ?? '');
      setTagline(s['team_tagline'] ?? '');
      setCopyrightName(s['copyright_name'] ?? '');
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await Promise.all([
        settingsApi.set('team_name', teamName),
        settingsApi.set('team_tagline', tagline),
        settingsApi.set('copyright_name', copyrightName),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Configure site-wide content.</p>
      </div>

      <Card className="space-y-5">
        <h2 className="font-semibold text-[var(--text-primary)]">Branding</h2>
        <Input
          label="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          hint="Displayed in the site header and hero section."
        />
        <Input
          label="Team Tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          hint="Short subtitle shown in the hero."
        />
        <Input
          label="Copyright Name"
          value={copyrightName}
          onChange={(e) => setCopyrightName(e.target.value)}
          hint="Used in the footer copyright notice."
        />

        <div className="flex items-center gap-3 pt-2">
          <Button loading={saving} onClick={handleSave}>Save Settings</Button>
          {saved && (
            <span className="text-sm text-green-500">Saved successfully</span>
          )}
        </div>
      </Card>
    </div>
  );
}
