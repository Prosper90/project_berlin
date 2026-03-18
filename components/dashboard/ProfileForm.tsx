'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import type { Profile } from '@/types';

interface ProfileFormProps {
  profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    first_name: profile.first_name ?? '',
    last_name: profile.last_name ?? '',
    company: profile.company ?? '',
    bio: profile.bio ?? '',
    website_url: profile.website_url ?? '',
    twitter_url: profile.twitter_url ?? '',
    instagram_url: profile.instagram_url ?? '',
    linkedin_url: profile.linkedin_url ?? '',
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        company: form.company || null,
        bio: form.bio || null,
        website_url: form.website_url || null,
        twitter_url: form.twitter_url || null,
        instagram_url: form.instagram_url || null,
        linkedin_url: form.linkedin_url || null,
      })
      .eq('id', profile.id);

    setLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          ✓ Profile updated successfully
        </div>
      )}

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Your Profile</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              required
              value={form.first_name}
              onChange={(e) => set('first_name', e.target.value)}
            />
            <Input
              label="Last Name"
              required
              value={form.last_name}
              onChange={(e) => set('last_name', e.target.value)}
            />
          </div>
          <Input
            label="Company / Organisation"
            placeholder="Your company (shown on your events)"
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
          />
          <Textarea
            label="Bio"
            placeholder="Tell the Berlin blockchain community about yourself..."
            value={form.bio}
            onChange={(e) => set('bio', e.target.value)}
            rows={3}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Social Links</h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Website"
            type="url"
            placeholder="https://yourwebsite.com"
            value={form.website_url}
            onChange={(e) => set('website_url', e.target.value)}
          />
          <Input
            label="Twitter / X"
            placeholder="https://x.com/yourhandle"
            value={form.twitter_url}
            onChange={(e) => set('twitter_url', e.target.value)}
          />
          <Input
            label="Instagram"
            placeholder="https://instagram.com/yourhandle"
            value={form.instagram_url}
            onChange={(e) => set('instagram_url', e.target.value)}
          />
          <Input
            label="LinkedIn"
            placeholder="https://linkedin.com/in/yourhandle"
            value={form.linkedin_url}
            onChange={(e) => set('linkedin_url', e.target.value)}
          />
        </div>
      </section>

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" loading={loading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
