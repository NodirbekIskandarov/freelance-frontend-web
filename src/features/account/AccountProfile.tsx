'use client';

import { Loader2, Pencil, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { TextField } from '@/components/ui/Field';
import { getApiErrorMessage } from '@/shared/api/errors';
import { FREELANCER_STATUS_LABELS, displayName, type AppUser } from '@/shared/types/auth';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from '@/features/profile/profileApi';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

/** O'zgartirib bo'lmaydigan maydonlar — ular boshqa oqimlarda boshqariladi. */
function readOnlyRows(user: AppUser): { label: string; value: string }[] {
  return [
    { label: 'Telefon raqam', value: user.phone ?? '—' },
    { label: 'Email', value: user.email || '—' },
    { label: 'Universitet', value: user.profile?.university_display || '—' },
    {
      label: 'Holat',
      value: FREELANCER_STATUS_LABELS[user.freelancer_profile?.status ?? 'none'],
    },
  ];
}

function AvatarUpload({ user }: { user: AppUser }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadAvatar, { isLoading, error }] = useUploadAvatarMutation();

  const avatar = user.profile?.avatar;

  return (
    <div className="flex items-center gap-4">
      {avatar ? (
        // Backend rasm domenlari oldindan noma'lum, shuning uchun
        // `next/image` emas, oddiy `<img>`.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" className="size-16 rounded-full object-cover" />
      ) : (
        <span className="grid size-16 place-items-center rounded-full bg-emerald-500 text-lg font-bold text-white">
          {displayName(user).slice(0, 2).toUpperCase()}
        </span>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadAvatar(file);
            // Bir xil faylni qayta tanlash ham `change` hodisasini
            // chiqarishi uchun qiymat tozalanadi.
            event.target.value = '';
          }}
        />

        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => inputRef.current?.click()}
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Upload className="size-3.5" />
          )}
          Rasm yuklash
        </Button>

        {error && <p className="mt-1.5 text-xs text-destructive">{getApiErrorMessage(error)}</p>}
      </div>
    </div>
  );
}

function ProfileForm({ user, onDone }: { user: AppUser; onDone: () => void }) {
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();
  const profile = user.profile;

  const [firstName, setFirstName] = useState(profile?.first_name ?? '');
  const [lastName, setLastName] = useState(profile?.last_name ?? '');
  const [telegram, setTelegram] = useState(profile?.telegram ?? '');
  const [course, setCourse] = useState(profile?.course ? String(profile.course) : '');
  const [bio, setBio] = useState(profile?.bio ?? '');

  async function handleSubmit() {
    const parsedCourse = course.trim() === '' ? null : Number(course);

    try {
      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        telegram: telegram.trim(),
        bio: bio.trim(),
        course: Number.isNaN(parsedCourse) ? null : parsedCourse,
      }).unwrap();
    } catch {
      return;
    }

    onDone();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Ism"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <TextField
          label="Familiya"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Telegram"
          placeholder="@username"
          value={telegram}
          onChange={(event) => setTelegram(event.target.value)}
        />
        <TextField
          label="Kurs"
          type="number"
          min={1}
          max={6}
          value={course}
          onChange={(event) => setCourse(event.target.value)}
        />
      </div>

      <TextField label="Bio" value={bio} onChange={(event) => setBio(event.target.value)} />

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {getApiErrorMessage(error)}
        </p>
      )}

      <div className="flex gap-2">
        <Button variant="emerald" disabled={isLoading} onClick={() => void handleSubmit()}>
          {isLoading ? 'Saqlanmoqda…' : 'Saqlash'}
        </Button>
        <Button variant="outline" onClick={onDone}>
          Bekor qilish
        </Button>
      </div>
    </div>
  );
}

export function AccountProfile() {
  const { data: user, isLoading, error } = useGetProfileQuery();
  const [editing, setEditing] = useState(false);

  // Foydalanuvchi almashsa (chiqib, boshqa hisob bilan kirsa) forma
  // ochiq qolib ketmasin.
  useEffect(() => setEditing(false), [user?.id]);

  if (error) return <ErrorNotice error={error} />;
  if (isLoading || !user) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;

  return (
    <div className="rounded-xl border border-border/60 bg-background p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AvatarUpload user={user} />

        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="size-3.5" />
            Tahrirlash
          </Button>
        )}
      </div>

      <div className="mt-5">
        {editing ? (
          <ProfileForm user={user} onDone={() => setEditing(false)} />
        ) : (
          <dl className="divide-y divide-border">
            <Row label="Ism familiya" value={displayName(user)} />
            {readOnlyRows(user).map((row) => (
              <Row key={row.label} label={row.label} value={row.value} />
            ))}
            <Row label="Telegram" value={user.profile?.telegram || '—'} />
            <Row label="Kurs" value={user.profile?.course ? `${user.profile.course}-kurs` : '—'} />
          </dl>
        )}
      </div>
    </div>
  );
}
