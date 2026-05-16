'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORY_LABELS, STATUS_LABELS, AVAILABLE_YEARS } from '@/lib/constants';
import { toast } from 'sonner';
import Image from 'next/image';
import { Upload, Loader2 } from 'lucide-react';
import type { Program } from '@/types';

const schema = z.object({
  title: z.string().min(3, 'Minimal 3 karakter').max(200),
  description: z.string().min(10, 'Minimal 10 karakter'),
  year: z.number().int().min(2024).max(2030),
  category: z.enum(['pendidikan', 'kesehatan', 'lingkungan', 'ekonomi', 'infrastruktur', 'sosial']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD'),
  location: z.string().min(2, 'Minimal 2 karakter'),
  beneficiariesCount: z.number().int().min(0),
  budget: z.number().min(0),
  status: z.enum(['planned', 'ongoing', 'completed']),
  imageUrl: z.string().min(1, 'Gambar wajib diisi').refine(
    (v) => v.startsWith('/') || /^https?:\/\//.test(v),
    'URL atau path gambar tidak valid'
  ),
  impactDescription: z.string(),
  tags: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  program?: Program;
}

export default function ProgramForm({ program }: Props) {
  const router = useRouter();
  const isEdit = !!program;
  const [previewError, setPreviewError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: program
      ? {
          ...program,
          tags: program.tags.join(', '),
        }
      : { year: 2024, status: 'planned', beneficiariesCount: 0, budget: 0, tags: '', imageUrl: '' },
  });

  const imageUrl = watch('imageUrl');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreviewError(false);

    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();

    setUploading(false);
    e.target.value = '';

    if (res.ok) {
      setValue('imageUrl', data.url, { shouldValidate: true });
      toast.success('Gambar berhasil diunggah');
    } else {
      toast.error(data.error ?? 'Gagal mengunggah gambar');
    }
  };

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      tags: values.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    const url = isEdit ? `/api/programs/${program!.id}` : '/api/programs';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(isEdit ? 'Program berhasil diperbarui' : 'Program berhasil ditambahkan');
      router.push('/admin/programs');
      router.refresh();
    } else {
      toast.error('Gagal menyimpan program. Coba lagi.');
    }
  };

  const field = (id: keyof FormValues, label: string, required = false) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </Label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Judul Program <span className="text-destructive">*</span></Label>
        <Input id="title" {...register('title')} placeholder="Contoh: Elektrifikasi Desa Terpencil" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Deskripsi <span className="text-destructive">*</span></Label>
        <Textarea id="description" {...register('description')} rows={4} placeholder="Deskripsi lengkap program..." />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      {/* Row: Year + Category + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Tahun <span className="text-destructive">*</span></Label>
          <Select
            defaultValue={String(program?.year ?? 2024)}
            onValueChange={(v) => setValue('year', Number(v))}
          >
            <SelectTrigger className="cursor-pointer"><SelectValue /></SelectTrigger>
            <SelectContent>
              {AVAILABLE_YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Kategori <span className="text-destructive">*</span></Label>
          <Select
            defaultValue={program?.category}
            onValueChange={(v) => setValue('category', v as FormValues['category'])}
          >
            <SelectTrigger className="cursor-pointer"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive">Wajib diisi</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Status <span className="text-destructive">*</span></Label>
          <Select
            defaultValue={program?.status ?? 'planned'}
            onValueChange={(v) => setValue('status', v as FormValues['status'])}
          >
            <SelectTrigger className="cursor-pointer"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row: Date + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="date">Tanggal <span className="text-destructive">*</span></Label>
          <Input id="date" type="date" {...register('date')} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Lokasi <span className="text-destructive">*</span></Label>
          <Input id="location" {...register('location')} placeholder="Contoh: Lebak, Banten" />
          {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
        </div>
      </div>

      {/* Row: Beneficiaries + Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="beneficiariesCount">Jumlah Penerima Manfaat</Label>
          <Input id="beneficiariesCount" type="number" min={0} {...register('beneficiariesCount', { valueAsNumber: true })} />
          {errors.beneficiariesCount && <p className="text-xs text-destructive">{errors.beneficiariesCount.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="budget">Anggaran (Rupiah)</Label>
          <Input id="budget" type="number" min={0} {...register('budget', { valueAsNumber: true })} placeholder="Contoh: 500000000" />
          {errors.budget && <p className="text-xs text-destructive">{errors.budget.message}</p>}
        </div>
      </div>

      {/* Image */}
      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Foto Program <span className="text-destructive">*</span></Label>

        {/* Upload button */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer gap-1.5"
          >
            {uploading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" />Mengunggah...</>
            ) : (
              <><Upload className="h-3.5 w-3.5" />Upload Foto</>
            )}
          </Button>
          <span className="text-xs text-muted-foreground">JPG, PNG, WebP — maks. 5 MB</span>
        </div>

        {/* Manual URL input */}
        <Input
          id="imageUrl"
          {...register('imageUrl')}
          placeholder="Atau tempel URL gambar..."
          onChange={(e) => { register('imageUrl').onChange(e); setPreviewError(false); }}
        />
        {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}

        {/* Preview */}
        {imageUrl && !previewError && (
          <div className="relative mt-2 aspect-video w-full max-w-xs rounded-lg overflow-hidden border border-border bg-muted">
            <Image
              src={imageUrl}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => setPreviewError(true)}
              unoptimized
              sizes="320px"
            />
          </div>
        )}
        {previewError && <p className="text-xs text-muted-foreground">Tidak dapat memuat preview gambar.</p>}
      </div>

      {/* Impact */}
      <div className="space-y-1.5">
        <Label htmlFor="impactDescription">Dampak &amp; Hasil</Label>
        <Textarea id="impactDescription" {...register('impactDescription')} rows={3} placeholder="Deskripsikan dampak nyata dari program ini..." />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label htmlFor="tags">Tag</Label>
        <Input id="tags" {...register('tags')} placeholder="Contoh: PLN Peduli, Elektrifikasi, Desa (pisahkan dengan koma)" />
        <p className="text-xs text-muted-foreground">Pisahkan setiap tag dengan tanda koma.</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
          {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Program'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/programs')} className="cursor-pointer">
          Batal
        </Button>
      </div>
    </form>
  );
}
