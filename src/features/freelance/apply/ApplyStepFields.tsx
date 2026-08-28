'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import {
  EXPERIENCE_LEVELS as REAL_EXPERIENCE_LEVELS,
  experienceLevelLabel as REAL_EXPERIENCE_LABELS,
  WORK_DIRECTIONS,
  workDirectionLabel,
} from '@/shared/types/publicFreelance';
import { DOCUMENT_TYPE_LABELS, DOCUMENT_TYPES } from '@/shared/types/publicFreelance';
import type { FreelancerApplicationDraft } from '@/shared/types/freelancerApplication';

import {
  useSendApplicationPhoneCodeMutation,
  useVerifyApplicationPhoneMutation,
} from '../publicFreelancersApi';
import type { DraftErrors } from './steps';
import { useT } from '@/i18n/useT';

export interface StepFieldsProps {
  draft: FreelancerApplicationDraft;
  errors: DraftErrors;
  update: (patch: Partial<FreelancerApplicationDraft>) => void;
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function PersonalStep({ draft, errors, update }: StepFieldsProps) {
  const { m } = useT();
  const [sendCode, { data: codeData, error: sendError, isLoading: isSending }] =
    useSendApplicationPhoneCodeMutation();
  const [verifyCode, { error: verifyError, isLoading: isVerifying }] =
    useVerifyApplicationPhoneMutation();
  const [code, setCode] = useState('');

  async function handleVerify() {
    try {
      await verifyCode({ phone: draft.phone, code }).unwrap();
      update({ phoneVerified: true });
    } catch {
      // Xato quyida ko'rsatiladi; kiritilgan kod formada qoladi.
    }
  }

  return (
    <div className="space-y-4">
      <Grid>
        <TextField
          label={m.apply.firstName}
          required
          value={draft.firstName}
          error={errors.firstName}
          onChange={(event) => update({ firstName: event.target.value })}
        />
        <TextField
          label={m.apply.lastName}
          required
          value={draft.lastName}
          error={errors.lastName}
          onChange={(event) => update({ lastName: event.target.value })}
        />
      </Grid>

      <div className="flex items-end gap-2">
        <TextField
          label={m.apply.phone}
          required
          type="tel"
          inputMode="tel"
          placeholder={m.apply.phonePlaceholder}
          value={draft.phone}
          error={errors.phone}
          className="flex-1"
          onChange={(event) => update({ phone: event.target.value, phoneVerified: false })}
        />
        <Button
          variant="outline"
          className="h-11"
          disabled={!draft.phone.trim() || isSending}
          onClick={() => void sendCode({ phone: draft.phone })}
        >
          {isSending ? m.apply.sending : m.apply.sendCode}
        </Button>
      </div>

      {/* Demo kod faqat sinov muhitida qaytariladi. */}
      {codeData?.demo_code && (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-300">
          {m.apply.demoCode} <strong>{codeData.demo_code}</strong>
        </p>
      )}
      {sendError && <p className="text-xs text-destructive">{getApiErrorMessage(sendError)}</p>}

      <div className="flex items-end gap-2">
        <TextField
          label={m.apply.phoneVerification}
          inputMode="numeric"
          maxLength={6}
          placeholder={m.apply.codePlaceholder}
          value={code}
          error={errors.phoneVerified}
          className="flex-1"
          disabled={draft.phoneVerified}
          onChange={(event) => setCode(event.target.value)}
        />
        <Button
          variant="emerald"
          className="h-11"
          disabled={code.length !== 6 || draft.phoneVerified || isVerifying}
          onClick={() => void handleVerify()}
        >
          {m.apply.confirm}
        </Button>
      </div>

      <p
        className={cn(
          'text-xs font-medium',
          draft.phoneVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
        )}
      >
        {draft.phoneVerified ? m.apply.verified : m.apply.notVerified}
      </p>
      {verifyError && !draft.phoneVerified && (
        <p className="text-xs text-destructive">{getApiErrorMessage(verifyError)}</p>
      )}

      <TextField
        label={m.apply.telegram}
        placeholder="@username"
        value={draft.telegram}
        onChange={(event) => update({ telegram: event.target.value })}
      />
    </div>
  );
}

function DocumentStep({ draft, errors, update }: StepFieldsProps) {
  const { m } = useT();
  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-xl border border-border bg-muted/50 p-1">
        {DOCUMENT_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => update({ documentType: type })}
            aria-pressed={draft.documentType === type}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
              draft.documentType === type
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {DOCUMENT_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {draft.documentType === 'passport' ? (
        <Grid>
          <TextField
            label={m.apply.passportSeries}
            required
            placeholder="AA"
            maxLength={2}
            value={draft.passportSeries}
            error={errors.passportSeries}
            onChange={(event) => update({ passportSeries: event.target.value.toUpperCase() })}
          />
          <TextField
            label={m.apply.passportNumber}
            required
            inputMode="numeric"
            placeholder="1234567"
            maxLength={7}
            value={draft.passportNumber}
            error={errors.passportNumber}
            onChange={(event) => update({ passportNumber: event.target.value })}
          />
        </Grid>
      ) : (
        <TextField
          label={m.apply.idCardNumber}
          required
          placeholder="AB1234567"
          value={draft.idCardNumber}
          error={errors.idCardNumber}
          onChange={(event) => update({ idCardNumber: event.target.value.toUpperCase() })}
        />
      )}

      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        {m.apply.documentNote}.
      </p>
    </div>
  );
}

function EducationStep({ draft, errors, update }: StepFieldsProps) {
  const { m } = useT();
  return (
    <div className="space-y-4">
      <TextField
        label={m.apply.city}
        required
        placeholder={m.apply.cityPlaceholder}
        value={draft.city}
        error={errors.city}
        onChange={(event) => update({ city: event.target.value })}
      />
      <Grid>
        <TextField
          label={m.apply.studyPlace}
          required
          placeholder={m.apply.university}
          value={draft.university}
          error={errors.university}
          onChange={(event) => update({ university: event.target.value })}
        />
        <TextField
          label={m.apply.faculty}
          required
          value={draft.faculty}
          error={errors.faculty}
          onChange={(event) => update({ faculty: event.target.value })}
        />
      </Grid>
      <Grid>
        <TextField
          label={m.apply.course}
          placeholder={m.apply.coursePlaceholder}
          value={draft.course}
          onChange={(event) => update({ course: event.target.value })}
        />
        <TextField
          label={m.apply.major}
          placeholder={m.apply.majorPlaceholder}
          value={draft.major}
          onChange={(event) => update({ major: event.target.value })}
        />
      </Grid>
    </div>
  );
}

function AdditionalStep({ draft, errors, update }: StepFieldsProps) {
  const { m } = useT();
  return (
    <div className="space-y-4">
      <div>
        <TextAreaField
          label={m.apply.bio}
          required
          rows={4}
          maxLength={500}
          placeholder={m.apply.bioPlaceholder}
          value={draft.about}
          error={errors.about}
          onChange={(event) => update({ about: event.target.value })}
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">{draft.about.length}/500</p>
      </div>

      <TextAreaField
        label={m.apply.motivation}
        rows={3}
        maxLength={500}
        placeholder={m.apply.motivationPlaceholder}
        value={draft.motivation}
        onChange={(event) => update({ motivation: event.target.value })}
      />

      <TextField
        label={m.apply.availability}
        placeholder={m.apply.availabilityPlaceholder}
        value={draft.availability}
        onChange={(event) => update({ availability: event.target.value })}
      />
    </div>
  );
}

function SpecialityStep({ draft, errors, update }: StepFieldsProps) {
  const { m } = useT();

  /* Ro'yxatlar komponent ICHIDA: yorliqlar tilga bog'liq va modul
     yuklanganda qaysi til tanlanganini bilib bo'lmaydi. */
  const directionOptions = WORK_DIRECTIONS.map((value) => ({
    value,
    label: workDirectionLabel(value, m),
  }));

  const experienceOptions = REAL_EXPERIENCE_LEVELS.map((level) => ({
    value: level,
    label: REAL_EXPERIENCE_LABELS(level, m),
  }));

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
        {m.apply.directionNoteLead} <strong>{m.apply.directionNoteBold}</strong>
        {m.apply.directionNoteMid} <strong>{m.apply.directionNoteSelf}</strong>{' '}
        {m.apply.directionNoteTail}
      </p>

      <Grid>
        <SelectField
          label={m.apply.workType}
          options={directionOptions}
          value={draft.direction}
          onChange={(event) => update({ direction: event.target.value })}
        />
        <SelectField
          label={m.apply.experience}
          options={experienceOptions}
          value={draft.experienceLevel}
          onChange={(event) =>
            update({
              experienceLevel: event.target.value as FreelancerApplicationDraft['experienceLevel'],
            })
          }
        />
      </Grid>

      <TextField
        label={m.apply.skills}
        required
        placeholder={m.apply.skillsPlaceholder}
        value={draft.skills}
        error={errors.skills}
        hint={m.apply.skillsHint}
        onChange={(event) => update({ skills: event.target.value })}
      />

      <TextField
        label={m.apply.portfolio}
        type="url"
        placeholder="https://..."
        value={draft.portfolioUrl}
        onChange={(event) => update({ portfolioUrl: event.target.value })}
      />
    </div>
  );
}

function ConfirmStep({ draft, errors, update }: StepFieldsProps) {
  const { m } = useT();
  const summary: { label: string; value: string }[] = [
    { label: m.apply.summaryName, value: `${draft.firstName} ${draft.lastName}`.trim() },
    { label: m.apply.summaryPhone, value: draft.phone },
    { label: m.apply.summaryTelegram, value: draft.telegram || '—' },
    {
      label: m.apply.summaryDocument,
      value:
        draft.documentType === 'passport'
          ? `${draft.passportSeries} ${draft.passportNumber}`.trim()
          : draft.idCardNumber,
    },
    { label: m.apply.summaryCity, value: draft.city },
    { label: m.apply.university, value: draft.university },
    { label: m.apply.summaryFaculty, value: draft.faculty },
    { label: m.apply.major, value: draft.major || '—' },
    { label: m.apply.summaryExperience, value: REAL_EXPERIENCE_LABELS(draft.experienceLevel, m) },
    { label: m.apply.skills, value: draft.skills },
  ];

  const checks = [
    {
      key: 'dataConfirmed' as const,
      label: m.apply.checkData,
    },
    {
      key: 'documentsConfirmed' as const,
      label: m.apply.checkDocuments,
    },
    { key: 'rulesAccepted' as const, label: m.apply.checkRules },
  ];

  return (
    <div className="space-y-4">
      <dl className="rounded-xl border border-border bg-muted/40 px-4 py-2">
        {summary.map((row) => (
          <div
            key={row.label}
            className="flex justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0"
          >
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="text-right font-medium text-foreground">{row.value || '—'}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-2">
        {checks.map((check) => (
          <label
            key={check.key}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/40 p-3"
          >
            <input
              type="checkbox"
              checked={draft[check.key]}
              onChange={(event) => update({ [check.key]: event.target.checked })}
              className="mt-0.5 size-4 accent-emerald-600"
            />
            <span className="text-sm text-foreground">{check.label}</span>
          </label>
        ))}
      </div>

      {(errors.dataConfirmed || errors.documentsConfirmed || errors.rulesAccepted) && (
        <p className="text-xs text-destructive">
          {errors.dataConfirmed ?? errors.documentsConfirmed ?? errors.rulesAccepted}
        </p>
      )}
    </div>
  );
}

/** Bosqich tartibi `APPLY_STEPS` bilan bir xil bo'lishi shart. */
export const STEP_FIELDS = [
  PersonalStep,
  DocumentStep,
  EducationStep,
  AdditionalStep,
  SpecialityStep,
  ConfirmStep,
];
