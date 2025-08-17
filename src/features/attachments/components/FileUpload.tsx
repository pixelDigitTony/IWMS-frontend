import { useState } from 'react';
import { presignUpload, uploadToPresignedUrl } from '../api';
import { Button } from '@/shared/ui/Button';

type Props = { folder?: string };

export function FileUpload({ folder = 'uploads' }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError(null); setOk(false);
    try {
      const key = `${folder}/${Date.now()}-${file.name}`;
      const url = await presignUpload(key, file.type);
      await uploadToPresignedUrl(url, file);
      setOk(true);
    } catch (err: any) {
      setError(err.message || 'Upload error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm">Select file</label>
      <input className="hidden" id="file-input" type="file" onChange={onChange} disabled={busy} />
      <Button variant="outline" size="sm" onClick={() => document.getElementById('file-input')?.click()} disabled={busy}>
        {busy ? 'Uploading…' : 'Choose File'}
      </Button>
      {ok && <span className="text-sm text-green-600">Done</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}


