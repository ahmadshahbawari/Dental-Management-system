/**
 * I18n Context — provides a single shared language state to the whole app.
 * All components that call useI18n() read from this context, so changing
 * the language in the TopBar instantly re-renders every subscriber.
 */
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type Lang = 'en' | 'fa' | 'ps';

const LANG_KEY = 'dental_lab_lang';
const RTL_LANGS: Lang[] = ['fa', 'ps'];

// ─── Full translation dictionaries ────────────────────────────────────────────
const T: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    dashboard: 'Dashboard', visits: 'Visits', cases: 'Cases',
    patients: 'Patients', dentists: 'Dentists', clinics: 'Clinics',
    production: 'Production', qc: 'QC', inventory: 'Inventory',
    invoices: 'Invoices', payments: 'Payments', expenses: 'Expenses',
    reports: 'Reports', users: 'Users', settings: 'Settings',
    // Common
    search: 'Search', new: 'New', save: 'Save', cancel: 'Cancel',
    edit: 'Edit', delete: 'Delete', view: 'View Details',
    active: 'Active', inactive: 'Inactive', status: 'Status',
    actions: 'Actions', name: 'Name', phone: 'Phone', email: 'Email',
    address: 'Address', date: 'Date', notes: 'Notes', total: 'Total',
    loading: 'Loading…', noResults: 'No results found', close: 'Close',
    // Login
    signIn: 'Sign In', username: 'Username', password: 'Password',
    signingIn: 'Signing in…',
    loginError: 'Invalid username or password.',
    demoHint: 'Demo: admin/admin123 · sara/sara123 · khalid/khalid123',
    // Page titles
    dashboardTitle: 'Dashboard', visitsTitle: 'Visits',
    casesTitle: 'Cases', patientsTitle: 'Patients',
    dentistsTitle: 'Dentists', clinicsTitle: 'Clinics',
    productionTitle: 'Production Board', qcTitle: 'Quality Control',
    inventoryTitle: 'Inventory', invoicesTitle: 'Invoices',
    paymentsTitle: 'Payments', expensesTitle: 'Expenses',
    reportsTitle: 'Reports', usersTitle: 'User Management',
    settingsTitle: 'Settings',
    // Subtitles
    dashboardSub: "Here's what's happening today.",
    visitsSub: 'Manage patient visits',
    casesSub: 'Manage dental laboratory cases',
    patientsSub: 'Manage patient records',
    dentistsSub: 'Manage dentist profiles',
    clinicsSub: 'Manage dental clinic information',
    // Buttons
    newVisit: 'New Visit', newCase: 'New Case', newPatient: 'New Patient',
    newDentist: 'New Dentist', newClinic: 'New Clinic',
    addItem: 'Add New Item', createInvoice: 'Create Invoice',
    recordPayment: 'Record Payment', addExpense: 'Add Expense',
    addUser: 'Add User',
    // Fields
    firstName: 'First Name', lastName: 'Last Name',
    dateOfBirth: 'Date of Birth', gender: 'Gender',
    male: 'Male', female: 'Female', other: 'Other',
    allergies: 'Allergies', medicalNotes: 'Medical Notes',
    patient: 'Patient', dentist: 'Dentist', clinic: 'Clinic',
    visitDate: 'Visit Date', chiefComplaint: 'Chief Complaint',
    diagnosis: 'Diagnosis', instructions: 'Instructions',
    requiresLab: 'Requires Lab',
    // Pagination
    previous: 'Previous', next: 'Next',
    rowsPerPage: 'Rows', of: 'of', page: 'Page',
    // Filters
    allStatus: 'All Status', allClinics: 'All Clinics',
    filter: 'Filter',
  },
  fa: {
    // Nav
    dashboard: 'داشبورد', visits: 'ویزیت‌ها', cases: 'قضایا',
    patients: 'بیماران', dentists: 'دندانپزشکان', clinics: 'کلینیک‌ها',
    production: 'تولید', qc: 'کنترل کیفیت', inventory: 'موجودی',
    invoices: 'فاکتورها', payments: 'پرداخت‌ها', expenses: 'مصارف',
    reports: 'گزارش‌ها', users: 'کاربران', settings: 'تنظیمات',
    // Common
    search: 'جستجو', new: 'جدید', save: 'ذخیره', cancel: 'لغو',
    edit: 'ویرایش', delete: 'حذف', view: 'مشاهده جزئیات',
    active: 'فعال', inactive: 'غیرفعال', status: 'وضعیت',
    actions: 'عملیات', name: 'نام', phone: 'شماره تلفن', email: 'ایمیل',
    address: 'آدرس', date: 'تاریخ', notes: 'یادداشت', total: 'مجموع',
    loading: 'در حال بارگذاری…', noResults: 'نتیجه‌ای یافت نشد', close: 'بستن',
    // Login
    signIn: 'ورود', username: 'نام کاربری', password: 'رمز عبور',
    signingIn: 'در حال ورود…',
    loginError: 'نام کاربری یا رمز عبور اشتباه است.',
    demoHint: 'نمایشی: admin/admin123 · sara/sara123 · khalid/khalid123',
    // Page titles
    dashboardTitle: 'داشبورد', visitsTitle: 'ویزیت‌ها',
    casesTitle: 'قضایا', patientsTitle: 'بیماران',
    dentistsTitle: 'دندانپزشکان', clinicsTitle: 'کلینیک‌ها',
    productionTitle: 'تخته تولید', qcTitle: 'کنترل کیفیت',
    inventoryTitle: 'موجودی', invoicesTitle: 'فاکتورها',
    paymentsTitle: 'پرداخت‌ها', expensesTitle: 'مصارف',
    reportsTitle: 'گزارش‌ها', usersTitle: 'مدیریت کاربران',
    settingsTitle: 'تنظیمات',
    // Subtitles
    dashboardSub: 'اتفاقات امروز را اینجا ببینید.',
    visitsSub: 'مدیریت ویزیت‌های بیماران',
    casesSub: 'مدیریت قضایای لابراتوار',
    patientsSub: 'مدیریت اطلاعات بیماران',
    dentistsSub: 'مدیریت پروفایل دندانپزشکان',
    clinicsSub: 'مدیریت اطلاعات کلینیک‌ها',
    // Buttons
    newVisit: 'ویزیت جدید', newCase: 'قضیه جدید', newPatient: 'بیمار جدید',
    newDentist: 'دندانپزشک جدید', newClinic: 'کلینیک جدید',
    addItem: 'افزودن آیتم', createInvoice: 'ایجاد فاکتور',
    recordPayment: 'ثبت پرداخت', addExpense: 'افزودن مصرف',
    addUser: 'افزودن کاربر',
    // Fields
    firstName: 'نام', lastName: 'تخلص',
    dateOfBirth: 'تاریخ تولد', gender: 'جنسیت',
    male: 'مذکر', female: 'مؤنث', other: 'سایر',
    allergies: 'حساسیت‌ها', medicalNotes: 'یادداشت‌های پزشکی',
    patient: 'بیمار', dentist: 'دندانپزشک', clinic: 'کلینیک',
    visitDate: 'تاریخ ویزیت', chiefComplaint: 'شکایت اصلی',
    diagnosis: 'تشخیص', instructions: 'دستورالعمل‌ها',
    requiresLab: 'نیاز به آزمایشگاه',
    // Pagination
    previous: 'قبلی', next: 'بعدی',
    rowsPerPage: 'ردیف', of: 'از', page: 'صفحه',
    // Filters
    allStatus: 'همه وضعیت‌ها', allClinics: 'همه کلینیک‌ها',
    filter: 'فیلتر',
  },
  ps: {
    // Nav
    dashboard: 'ډشبورډ', visits: 'ويزيتونه', cases: 'قضيې',
    patients: 'ناروغان', dentists: 'غاښپوهان', clinics: 'کلينيکونه',
    production: 'توليد', qc: 'کيفيت کنترول', inventory: 'ذخيره',
    invoices: 'فاکتورونه', payments: 'تادياتونه', expenses: 'لګښتونه',
    reports: 'راپورونه', users: 'کاربران', settings: 'تنظيمات',
    // Common
    search: 'لټون', new: 'نوی', save: 'خوندي کول', cancel: 'لغوه',
    edit: 'سمول', delete: 'ړنګول', view: 'توضيحات وګورئ',
    active: 'فعال', inactive: 'غيرفعال', status: 'حالت',
    actions: 'کړنې', name: 'نوم', phone: 'تلفن', email: 'بريښنالیک',
    address: 'پته', date: 'نيټه', notes: 'يادداشتونه', total: 'ټول',
    loading: 'بارول…', noResults: 'پايله ونه موندل شوه', close: 'بندول',
    // Login
    signIn: 'داخلول', username: 'کارن نوم', password: 'پټ نوم',
    signingIn: 'داخلېږي…',
    loginError: 'کارن نوم يا پټ نوم غلط دی.',
    demoHint: 'نمونه: admin/admin123 · sara/sara123 · khalid/khalid123',
    // Page titles
    dashboardTitle: 'ډشبورډ', visitsTitle: 'ويزيتونه',
    casesTitle: 'قضيې', patientsTitle: 'ناروغان',
    dentistsTitle: 'غاښپوهان', clinicsTitle: 'کلينيکونه',
    productionTitle: 'د توليد تخته', qcTitle: 'کيفيت کنترول',
    inventoryTitle: 'ذخيره', invoicesTitle: 'فاکتورونه',
    paymentsTitle: 'تادياتونه', expensesTitle: 'لګښتونه',
    reportsTitle: 'راپورونه', usersTitle: 'د کاربرانو مديريت',
    settingsTitle: 'تنظيمات',
    // Subtitles
    dashboardSub: 'د نن ورځې پيښې دلته وګورئ.',
    visitsSub: 'د ناروغانو ويزيتونو مديريت',
    casesSub: 'د لابراتوار قضيو مديريت',
    patientsSub: 'د ناروغانو معلوماتو مديريت',
    dentistsSub: 'د غاښپوهانو پروفايلونو مديريت',
    clinicsSub: 'د کلينيکونو معلوماتو مديريت',
    // Buttons
    newVisit: 'نوی ويزيت', newCase: 'نوی قضيه', newPatient: 'نوی ناروغ',
    newDentist: 'نوی غاښپوه', newClinic: 'نوی کلينيک',
    addItem: 'توکی اضافه کول', createInvoice: 'فاکتور جوړول',
    recordPayment: 'تاديه ثبتول', addExpense: 'لګښت اضافه کول',
    addUser: 'کارن اضافه کول',
    // Fields
    firstName: 'نوم', lastName: 'تخلص',
    dateOfBirth: 'د زيږون نيټه', gender: 'جنسيت',
    male: 'نارينه', female: 'ښځينه', other: 'نور',
    allergies: 'الرژۍ', medicalNotes: 'طبي يادداشتونه',
    patient: 'ناروغ', dentist: 'غاښپوه', clinic: 'کلينيک',
    visitDate: 'د ويزيت نيټه', chiefComplaint: 'لومړنۍ شکايت',
    diagnosis: 'تشخيص', instructions: 'لارښوونې',
    requiresLab: 'لابراتوار ته اړتيا',
    // Pagination
    previous: 'مخکینۍ', next: 'بعدي',
    rowsPerPage: 'کتار', of: 'له', page: 'مخ',
    // Filters
    allStatus: 'ټول حالتونه', allClinics: 'ټول کلينيکونه',
    filter: 'فيلتر',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const Ctx = createContext<I18nCtx>({
  lang: 'en',
  setLang: () => undefined,
  t: (k) => k,
  isRtl: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const s = localStorage.getItem(LANG_KEY) as Lang | null;
    return s && ['en','fa','ps'].includes(s) ? s : 'en';
  });

  const applyDir = useCallback((l: Lang) => {
    document.documentElement.lang = l;
    document.documentElement.dir = RTL_LANGS.includes(l) ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => { applyDir(lang); }, [lang, applyDir]);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
    applyDir(l);
  }, [applyDir]);

  const t = useCallback((key: string) => T[lang][key] ?? T['en'][key] ?? key, [lang]);

  return (
    <Ctx.Provider value={{ lang, setLang, t, isRtl: RTL_LANGS.includes(lang) }}>
      {children}
    </Ctx.Provider>
  );
}

/** Use this hook everywhere instead of the old useI18n from i18n.ts */
export function useI18n() {
  return useContext(Ctx);
}

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  fa: 'دری',
  ps: 'پښتو',
};
