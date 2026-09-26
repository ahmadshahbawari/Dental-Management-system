/**
 * Minimal i18n for 3 languages: English (LTR), Dari (RTL), Pashto (RTL)
 * Usage:  const { t, lang, setLang } = useI18n()
 */
import { useState, useEffect, useCallback } from 'react';

export type Lang = 'en' | 'fa' | 'ps';

const LANG_KEY = 'dental_lab_lang';
const RTL_LANGS: Lang[] = ['fa', 'ps'];

// ─── Translations ────────────────────────────────────────────────────────────
const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    dashboard: 'Dashboard',
    visits: 'Visits',
    cases: 'Cases',
    patients: 'Patients',
    dentists: 'Dentists',
    clinics: 'Clinics',
    production: 'Production',
    qc: 'QC',
    inventory: 'Inventory',
    invoices: 'Invoices',
    payments: 'Payments',
    expenses: 'Expenses',
    reports: 'Reports',
    users: 'Users',
    settings: 'Settings',
    // Common
    search: 'Search',
    new: 'New',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    active: 'Active',
    inactive: 'Inactive',
    status: 'Status',
    actions: 'Actions',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    date: 'Date',
    notes: 'Notes',
    total: 'Total',
    // Login
    signIn: 'Sign In',
    username: 'Username',
    password: 'Password',
    // Visits
    newVisit: 'New Visit',
    visitNumber: 'Visit Number',
    patient: 'Patient',
    dentist: 'Dentist',
    clinic: 'Clinic',
    visitDate: 'Visit Date',
    chiefComplaint: 'Chief Complaint',
    diagnosis: 'Diagnosis',
    instructions: 'Instructions',
    requiresLab: 'Requires Lab',
    // Patients
    newPatient: 'New Patient',
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    allergies: 'Allergies',
    medicalNotes: 'Medical Notes',
    // Pagination
    previous: 'Previous',
    next: 'Next',
    itemsPerPage: 'Items per page',
    of: 'of',
    page: 'Page',
  },
  fa: {
    // Nav
    dashboard: 'داشبورد',
    visits: 'ویزیت‌ها',
    cases: 'قضایا',
    patients: 'بیماران',
    dentists: 'دندانپزشکان',
    clinics: 'کلینیک‌ها',
    production: 'تولید',
    qc: 'کنترل کیفیت',
    inventory: 'موجودی',
    invoices: 'فاکتورها',
    payments: 'پرداخت‌ها',
    expenses: 'مصارف',
    reports: 'گزارش‌ها',
    users: 'کاربران',
    settings: 'تنظیمات',
    // Common
    search: 'جستجو',
    new: 'جدید',
    save: 'ذخیره',
    cancel: 'لغو',
    edit: 'ویرایش',
    delete: 'حذف',
    view: 'مشاهده',
    active: 'فعال',
    inactive: 'غیرفعال',
    status: 'وضعیت',
    actions: 'عملیات',
    name: 'نام',
    phone: 'شماره تلفن',
    email: 'ایمیل',
    address: 'آدرس',
    date: 'تاریخ',
    notes: 'یادداشت',
    total: 'مجموع',
    // Login
    signIn: 'ورود',
    username: 'نام کاربری',
    password: 'رمز عبور',
    // Visits
    newVisit: 'ویزیت جدید',
    visitNumber: 'شماره ویزیت',
    patient: 'بیمار',
    dentist: 'دندانپزشک',
    clinic: 'کلینیک',
    visitDate: 'تاریخ ویزیت',
    chiefComplaint: 'شکایت اصلی',
    diagnosis: 'تشخیص',
    instructions: 'دستورالعمل‌ها',
    requiresLab: 'نیاز به آزمایشگاه',
    // Patients
    newPatient: 'بیمار جدید',
    firstName: 'نام',
    lastName: 'تخلص',
    dateOfBirth: 'تاریخ تولد',
    gender: 'جنسیت',
    male: 'مذکر',
    female: 'مؤنث',
    allergies: 'حساسیت‌ها',
    medicalNotes: 'یادداشت‌های پزشکی',
    // Pagination
    previous: 'قبلی',
    next: 'بعدی',
    itemsPerPage: 'آیتم در هر صفحه',
    of: 'از',
    page: 'صفحه',
  },
  ps: {
    // Nav
    dashboard: 'ډشبورډ',
    visits: 'ويزيتونه',
    cases: 'قضيې',
    patients: 'ناروغان',
    dentists: 'دندانپزشکان',
    clinics: 'کلينيکونه',
    production: 'توليد',
    qc: 'کيفيت کنترول',
    inventory: 'ذخيره',
    invoices: 'فاکتورونه',
    payments: 'تادياتونه',
    expenses: 'لګښتونه',
    reports: 'راپورونه',
    users: 'کاربران',
    settings: 'تنظيمات',
    // Common
    search: 'لټون',
    new: 'نوی',
    save: 'خوندي کول',
    cancel: 'لغوه',
    edit: 'سمول',
    delete: 'ړنګول',
    view: 'کتل',
    active: 'فعال',
    inactive: 'غيرفعال',
    status: 'حالت',
    actions: 'کړنې',
    name: 'نوم',
    phone: 'تلفن',
    email: 'بريښنالیک',
    address: 'پته',
    date: 'نيټه',
    notes: 'يادداشتونه',
    total: 'ټول',
    // Login
    signIn: 'داخلول',
    username: 'کارن نوم',
    password: 'پټ نوم',
    // Visits
    newVisit: 'نوی ويزيت',
    visitNumber: 'د ويزيت شمېره',
    patient: 'ناروغ',
    dentist: 'غاښپوه',
    clinic: 'کلينيک',
    visitDate: 'د ويزيت نيټه',
    chiefComplaint: 'لومړنۍ شکايت',
    diagnosis: 'تشخيص',
    instructions: 'لارښوونې',
    requiresLab: 'لابراتوار ته اړتيا',
    // Patients
    newPatient: 'نوی ناروغ',
    firstName: 'نوم',
    lastName: 'تخلص',
    dateOfBirth: 'د زيږون نيټه',
    gender: 'جنسيت',
    male: 'نارينه',
    female: 'ښځينه',
    allergies: 'الرژۍ',
    medicalNotes: 'طبي يادداشتونه',
    // Pagination
    previous: 'مخکینۍ',
    next: 'بعدي',
    itemsPerPage: 'هر مخ توکي',
    of: 'له',
    page: 'مخ',
  },
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useI18n() {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(LANG_KEY) as Lang | null;
    return stored && ['en', 'fa', 'ps'].includes(stored) ? stored : 'en';
  });

  const applyDir = useCallback((l: Lang) => {
    const isRtl = RTL_LANGS.includes(l);
    document.documentElement.lang = l;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, []);

  // Apply on mount
  useEffect(() => { applyDir(lang); }, [lang, applyDir]);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
    applyDir(l);
  }, [applyDir]);

  const t = useCallback((key: string): string => {
    return translations[lang][key] ?? translations['en'][key] ?? key;
  }, [lang]);

  return { lang, setLang, t, isRtl: RTL_LANGS.includes(lang) };
}

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  fa: 'دری',
  ps: 'پښتو',
};
