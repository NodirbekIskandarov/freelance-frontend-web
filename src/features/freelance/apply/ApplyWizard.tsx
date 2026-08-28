'use client';

import { CheckCircle2, Clock, Shield } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { getApiErrorMessage } from '@/shared/api/errors';
import { isFreelancer } from '@/shared/types/auth';
import type { WorkDirection } from '@/shared/types/publicFreelance';
import type { FreelancerApplicationDraft } from '@/shared/types/freelancerApplication';
import { selectAuthHydrated, selectCurrentUser } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/hooks';

import { useGetMyApplicationQuery, useSubmitApplicationMutation } from '../publicFreelancersApi';
import { STEP_FIELDS } from './ApplyStepFields';
import { ApplyStepper } from './ApplyStepper';
import { APPLY_STEPS, EMPTY_DRAFT, type DraftErrors } from './steps';

export function ApplyWizard() {
  const hydrated = useAppSelector(selectAuthHydrated);
  const user = useAppSelector(selectCurrentUser);

  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<FreelancerApplicationDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<DraftErrors>({});

  const [submitApplication, { data: submitted, isLoading, error }] = useSubmitApplicationMutation();

  /*
   * Mavjud arizani olamiz. Ariza yuborilmagan bo'lsa backend 404
   * qaytaradi — bu xato emas, "hali ariza yo'q" degani, shuning uchun
   * xato holati alohida ko'rsatilmaydi.
   */
  const { data: existing } = useGetMyApplicationQuery(undefined, { skip: !user });

  if (!hydrated) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Yuklanmoqda...</p>;
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground">Kirish talab qilinadi</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Ariza yuborish uchun avval hisobingizga kiring. Hisobingiz bo&apos;lmasa, ro&apos;yxatdan
          o&apos;ting — bu bir daqiqa vaqt oladi.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <ButtonLink href="/login" variant="emerald">
            Kirish
          </ButtonLink>
          <ButtonLink href="/register" variant="outline">
            Ro&apos;yxatdan o&apos;tish
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (isFreelancer(user)) {
    return (
      <div className="rounded-2xl border border-emerald-500/25 bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-500" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">
          Siz allaqachon freelancer sifatidasiz
        </h2>
        <ButtonLink href="/freelancer/dashboard" variant="emerald" className="mt-5">
          Kabinetga o&apos;tish
        </ButtonLink>
      </div>
    );
  }

  {
    /* Ariza yuborilgan, lekin hali ko'rib chiqilmagan holat. */
  }
  if (user.freelancer_profile?.status === 'pending' || existing?.status === 'pending') {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-card p-8 text-center">
        <Clock className="mx-auto size-10 text-amber-500" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">
          Ariza ko&apos;rib chiqilmoqda
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Arizangiz 1–3 ish kuni ichida admin tomonidan tekshiriladi. Natija haqida xabar beramiz.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/25 bg-card px-6 py-14 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-500/15">
          <CheckCircle2 className="size-9 text-emerald-500" />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-foreground">Arizangiz yuborildi</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Arizangiz {submitted.review_days} ish kuni ichida admin tomonidan ko&apos;rib chiqiladi.
          Natija haqida xabar beramiz.
        </p>
        <ButtonLink href="/" variant="outline" className="mt-6">
          Bosh sahifaga
        </ButtonLink>
      </div>
    );
  }

  const step = APPLY_STEPS[stepIndex]!;
  const StepFields = STEP_FIELDS[stepIndex]!;
  const isLastStep = stepIndex === APPLY_STEPS.length - 1;

  function update(patch: Partial<FreelancerApplicationDraft>) {
    setDraft((current) => ({ ...current, ...patch }));

    // Tuzatilayotgan maydonning xatosi darhol o'chadi — foydalanuvchi
    // "Keyingisi"ni bosguncha qizil matnga qarab turmaydi.
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[key as keyof DraftErrors];
      return next;
    });
  }

  async function handleNext() {
    const stepErrors = step.validate(draft);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});

    if (!isLastStep) {
      setStepIndex((index) => index + 1);
      return;
    }

    try {
      await submitApplication({
        first_name: draft.firstName.trim(),
        last_name: draft.lastName.trim(),
        contact_phone: draft.phone.trim(),
        telegram: draft.telegram.trim(),
        document_type: draft.documentType,
        ...(draft.documentType === 'passport'
          ? {
              passport_series: draft.passportSeries.trim(),
              passport_number: draft.passportNumber.trim(),
            }
          : { id_card_number: draft.idCardNumber.trim() }),
        city: draft.city.trim(),
        university: draft.university.trim(),
        faculty: draft.faculty.trim(),
        course: draft.course.trim() ? Number(draft.course) : null,
        major: draft.major.trim(),
        about: draft.about.trim(),
        motivation: draft.motivation.trim(),
        availability_note: draft.availability.trim(),
        direction: draft.direction as WorkDirection,
        experience_level: draft.experienceLevel,
        // Backend MASSIV kutadi — formada vergul bilan yoziladi.
        skills: draft.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        portfolio_url: draft.portfolioUrl.trim(),
        data_confirmed: draft.dataConfirmed,
        documents_confirmed: draft.documentsConfirmed,
        rules_accepted: draft.rulesAccepted,
      }).unwrap();
    } catch {
      // Xato quyida ko'rsatiladi; to'ldirilgan forma saqlanib qoladi.
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1 space-y-6">
        <ApplyStepper current={stepIndex} />

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-base font-semibold text-foreground">{step.title}</h2>
          <StepFields draft={draft} errors={errors} update={update} />
        </section>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {stepIndex === 0 ? (
            <Link
              href="/freelance"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Bekor qilish
            </Link>
          ) : (
            <Button variant="outline" className="h-11" onClick={() => setStepIndex((i) => i - 1)}>
              Orqaga
            </Button>
          )}

          <Button
            variant="emerald"
            className="ml-auto h-11 px-8"
            disabled={isLoading}
            onClick={() => void handleNext()}
          >
            {isLoading ? 'Yuborilmoqda...' : isLastStep ? 'Ariza yuborish' : 'Keyingisi'}
          </Button>
        </div>
      </div>

      <aside className="space-y-4 lg:w-[280px] lg:shrink-0">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Ariza jarayoni</h2>
          <ol className="mt-4 space-y-3">
            {[
              "Ma'lumotlarni to'ldirish",
              'Hujjatlarni yuklash',
              'Admin tekshiruvi',
              'Tasdiqlash yoki rad etish',
              'Freelancer statusini olish',
            ].map((label, index) => (
              <li key={label} className="flex items-start gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">{label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/15">
            <Shield className="size-5 text-emerald-600 dark:text-emerald-400" />
          </span>
          <h2 className="mt-3 text-sm font-semibold text-foreground">Xavfsiz va maxfiy</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Hujjatlaringiz maxfiy saqlanadi va faqat admin tekshiruvi uchun ishlatiladi.
          </p>
        </div>
      </aside>
    </div>
  );
}
