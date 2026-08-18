'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { getApiErrorMessage } from '@/shared/api/errors';
import { DEADLINE_OPTIONS, type DeadlineDays } from '@/shared/types/exchange';
import { WORK_DIRECTION_LABELS, WORK_DIRECTIONS } from '@/shared/types/publicFreelance';
import type { WorkDirection } from '@/shared/types/publicFreelance';

import { useCreateTaskMutation } from './exchangeApi';

const directionOptions = WORK_DIRECTIONS.map((value) => ({
  value,
  label: WORK_DIRECTION_LABELS[value],
}));

const deadlineOptions = DEADLINE_OPTIONS.map((days) => ({
  value: String(days),
  label: `${days} kun`,
}));

export function CreateTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [createTask, { isLoading, error, reset }] = useCreateTaskMutation();

  const [title, setTitle] = useState('');
  const [direction, setDirection] = useState<WorkDirection>('programming');
  const [deadline, setDeadline] = useState('7');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [file, setFile] = useState<File | null>(null);

  function close() {
    reset();
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      await createTask({
        title: title.trim(),
        direction,
        deadline_days: Number(deadline) as DeadlineDays,
        ...(description.trim() ? { description: description.trim() } : {}),
        // Bo'sh budjet YUBORILMAYDI: backend `null`ni "kelishamiz" deb
        // qabul qiladi, bo'sh satr esa validatsiya xatosi beradi.
        ...(budget.trim() ? { budget: budget.trim() } : {}),
        ...(file ? { task_file: file } : {}),
      }).unwrap();
    } catch {
      // Xato quyida ko'rsatiladi; forma to'ldirilgancha qoladi.
      return;
    }

    setTitle('');
    setDescription('');
    setBudget('');
    setFile(null);
    close();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Topshiriq yaratish"
      description="Fayl, muddat va tavsif — freelancerlar taklif yuboradi."
      className="w-[min(38rem,calc(100vw-2rem))]"
    >
      <form id="create-task-form" onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Topshiriq nomi"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Masalan: Kurs ishi — ma'lumotlar bazasi loyihasi"
          maxLength={200}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Yo'nalish"
            required
            options={directionOptions}
            value={direction}
            onChange={(event) => setDirection(event.target.value as WorkDirection)}
          />
          <SelectField
            label="Muddat"
            required
            options={deadlineOptions}
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </div>

        <TextField
          label="Budjet (so'm)"
          type="number"
          min={0}
          step={1000}
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          placeholder="300000"
          hint="Bo'sh qoldirsangiz, narx takliflar orqali kelishiladi."
        />

        <TextAreaField
          label="Tavsif"
          rows={4}
          maxLength={2000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Talablar, hajm, format va boshqa tafsilotlar..."
          hint={`${description.length}/2000`}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">Topshiriq fayli</span>
          <input
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
        )}
      </form>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={close}>
          Bekor qilish
        </Button>
        <Button
          type="submit"
          form="create-task-form"
          variant="emerald"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? 'Yuborilmoqda...' : 'Joylashtirish'}
        </Button>
      </div>
    </Modal>
  );
}
