let EXCHANGE_RATE = 1; 
let BASE_CURRENCY = "EUR";
let TARGET_CURRENCY = "TRY";
let ALL_RATES = {}; 
let myChart = null; 
let trendChart = null;
let monthlyChart = null;
let monthlyCategoryChart = null;
let currentCategory = 'all';
let latestFilteredExpenses = [];
const selectedExpenseIds = new Set();
let lastDeletedSnapshot = null;
let undoTimer = null;
let isAdvancedVisible = false;
let isDetailModalOpen = false;
let isFilterVisible = false;
let currentLanguage = 'en';

const I18N = {
    en: {
        app_title: "Budget Management 💸",
        total_remaining_budget: "Total Remaining Budget",
        daily_limit: "Daily Safe-to-Spend Limit",
        weekly_monthly_summary: "Weekly & Monthly Summary",
        this_week_total: "This Week Total",
        this_month_total: "This Month Total",
        budget_setup: "📊 Budget Setup",
        my_budget_currency: "My Budget Currency",
        local_currency: "Local Currency",
        select_currency: "Select currency...",
        select_currency_short: "...",
        total_grant: "Total Grant",
        start_tracking: "START TRACKING",
        add_extra_funds: "💰 Add Extra Funds (Click to Open)",
        add_money_to_budget: "Add money to your budget",
        amount: "Amount",
        confirm_add: "CONFIRM & ADD",
        log_expenses: "Log your daily expenses",
        choose_category: "Choose Category...",
        note_optional: "Note (optional)",
        log_expense_button: "LOG EXPENSE",
        search_date_filter: "Search & date filter",
        search_category_note: "Search category or note",
        find_expense: "Find expense",
        hide_filters: "Hide filters",
        filter_all: "All",
        cat_food: "🍔 Food & Drink",
        cat_transport: "🚌 Transport",
        cat_entertainment: "🎉 Entertainment",
        cat_travel: "✈️ Travel",
        cat_investment: "📈 Investment",
        cat_health: "💊 Health",
        cat_other: "📦 Other",
        select_visible: "Select all",
        clear: "Clear",
        undo: "Undo",
        delete_selected: "Delete selected",
        recent_transactions: "Recent Transactions",
        detailed_view: "Detailed view",
        spending_breakdown: "Spending Breakdown",
        spending_trend: "Spending Trend",
        monthly_report: "Monthly Report",
        total_spend: "Total Spend",
        top_category: "Top Category",
        transactions: "Transactions",
        avg_per_day: "Avg / Day",
        export_excel: "📥 Export to Excel",
        items_deleted: "Items deleted.",
        export_json: "🧩 Export JSON Backup",
        import_json: "♻️ Import JSON Backup",
        reset_all: "Reset All Data",
        all_transactions: "All Transactions",
        close: "Close",
        select_all: "Select all",
        cancel: "Cancel",
        show_advanced: "Show advanced options",
        hide_advanced: "Hide advanced options",
        no_results: "No results found.",
        no_data_yet: "No data yet.",
        no_spending_yesterday_today: "No spending yesterday. Today: {amount}",
        no_spending_today: "No spending today.",
        today_vs_yesterday: "Today vs Yesterday: {percent}",
        trip_ended: "Trip Ended",
        top_prefix: "Top: {category}",
        alert_total_grant: "Please enter Total Grant!",
        alert_select_currencies: "Please select both currencies!",
        alert_invalid_amount: "Please enter a valid amount!",
        alert_select_currency: "Please select a currency!",
        alert_select_category: "Please select a category!",
        alert_setup_complete: "Setup Complete! Tracking Started. 🚀",
        alert_add_success: "Added funds successfully!",
        alert_excel_failed: "Excel export library failed to load. Please check your connection.",
        alert_delete_confirm: "Delete {count} selected items?",
        alert_reset_confirm: "Are you sure? All data will be lost!",
        alert_import_confirm: "Importing will replace current data. Continue?",
        alert_import_invalid: "Invalid backup file.",
        alert_import_failed: "Could not import backup file."
    },
    tr: {
        app_title: "Bütçe Yönetimi 💸",
        total_remaining_budget: "Toplam Kalan Bütçe",
        daily_limit: "Günlük Güvenli Harcama Limiti",
        weekly_monthly_summary: "Haftalık & Aylık Özet",
        this_week_total: "Bu Hafta Toplam",
        this_month_total: "Bu Ay Toplam",
        budget_setup: "📊 Bütçe Kurulumu",
        my_budget_currency: "Bütçe Para Birimi",
        local_currency: "Yerel Para Birimi",
        select_currency: "Para birimi seç...",
        select_currency_short: "...",
        total_grant: "Toplam Bütçe",
        start_tracking: "TAKİBİ BAŞLAT",
        add_extra_funds: "💰 Ek Bakiye Ekle (Açmak için tıkla)",
        add_money_to_budget: "Bütçene para ekle",
        amount: "Tutar",
        confirm_add: "ONAYLA & EKLE",
        log_expenses: "Günlük harcamalarını kaydet",
        choose_category: "Kategori seç...",
        note_optional: "Not (opsiyonel)",
        log_expense_button: "HARCAMA EKLE",
        search_date_filter: "Arama & tarih filtresi",
        search_category_note: "Kategori veya not ara",
        find_expense: "Harcamayı bul",
        hide_filters: "Filtreleri gizle",
        filter_all: "Tümü",
        cat_food: "🍔 Yeme & İçme",
        cat_transport: "🚌 Ulaşım",
        cat_entertainment: "🎉 Eğlence",
        cat_travel: "✈️ Seyahat",
        cat_investment: "📈 Yatırım",
        cat_health: "💊 Sağlık",
        cat_other: "📦 Diğer",
        select_visible: "Hepsini seç",
        clear: "Temizle",
        undo: "Geri al",
        delete_selected: "Seçileni sil",
        recent_transactions: "Son Harcamalar",
        detailed_view: "Detaylı göster",
        spending_breakdown: "Harcama Dağılımı",
        spending_trend: "Harcama Trendi",
        monthly_report: "Aylık Rapor",
        total_spend: "Toplam Harcama",
        top_category: "En çok kategori",
        transactions: "İşlem Sayısı",
        avg_per_day: "Günlük Ortalama",
        export_excel: "📥 Excel’e Aktar",
        items_deleted: "Öğeler silindi.",
        export_json: "🧩 JSON Yedekle",
        import_json: "♻️ JSON Geri Yükle",
        reset_all: "Tüm Veriyi Sıfırla",
        all_transactions: "Tüm Harcamalar",
        close: "Kapat",
        select_all: "Hepsini seç",
        cancel: "İptal",
        show_advanced: "Gelişmiş seçenekleri göster",
        hide_advanced: "Gelişmiş seçenekleri gizle",
        no_results: "Sonuç bulunamadı.",
        no_data_yet: "Henüz veri yok.",
        no_spending_yesterday_today: "Dün harcama yok. Bugün: {amount}",
        no_spending_today: "Bugün harcama yok.",
        today_vs_yesterday: "Bugün / Dün: {percent}",
        trip_ended: "Süre bitti",
        top_prefix: "En çok: {category}",
        alert_total_grant: "Lütfen toplam bütçeyi girin!",
        alert_select_currencies: "Lütfen para birimlerini seçin!",
        alert_invalid_amount: "Lütfen geçerli bir tutar girin!",
        alert_select_currency: "Lütfen para birimi seçin!",
        alert_select_category: "Lütfen kategori seçin!",
        alert_setup_complete: "Kurulum tamamlandı! Takip başladı. 🚀",
        alert_add_success: "Bakiye başarıyla eklendi!",
        alert_excel_failed: "Excel kütüphanesi yüklenemedi. Bağlantını kontrol et.",
        alert_delete_confirm: "{count} öğe silinsin mi?",
        alert_reset_confirm: "Emin misin? Tüm veri silinecek!",
        alert_import_confirm: "Yükleme mevcut veriyi değiştirecek. Devam edilsin mi?",
        alert_import_invalid: "Geçersiz yedek dosyası.",
        alert_import_failed: "Yedek dosyası yüklenemedi."
    },
    de: {
        app_title: "Budgetverwaltung 💸",
        total_remaining_budget: "Verbleibendes Gesamtbudget",
        daily_limit: "Tägliches Safe-to-Spend-Limit",
        weekly_monthly_summary: "Wöchentliche & monatliche Übersicht",
        this_week_total: "Diese Woche Gesamt",
        this_month_total: "Dieser Monat Gesamt",
        budget_setup: "📊 Budget-Setup",
        my_budget_currency: "Budgetwährung",
        local_currency: "Lokale Währung",
        select_currency: "Währung auswählen...",
        select_currency_short: "...",
        total_grant: "Gesamtbudget",
        start_tracking: "TRACKING STARTEN",
        add_extra_funds: "💰 Extra-Budget hinzufügen (klicken)",
        add_money_to_budget: "Geld zum Budget hinzufügen",
        amount: "Betrag",
        confirm_add: "BESTÄTIGEN & HINZUFÜGEN",
        log_expenses: "Tägliche Ausgaben erfassen",
        choose_category: "Kategorie auswählen...",
        note_optional: "Notiz (optional)",
        log_expense_button: "AUSGABE LOGGEN",
        search_date_filter: "Suche & Datumsfilter",
        search_category_note: "Kategorie oder Notiz suchen",
        find_expense: "Ausgabe finden",
        hide_filters: "Filter ausblenden",
        filter_all: "Alle",
        cat_food: "🍔 Essen & Trinken",
        cat_transport: "🚌 Transport",
        cat_entertainment: "🎉 Unterhaltung",
        cat_travel: "✈️ Reisen",
        cat_investment: "📈 Investition",
        cat_health: "💊 Gesundheit",
        cat_other: "📦 Sonstiges",
        select_visible: "Alle auswählen",
        clear: "Leeren",
        undo: "Rückgängig",
        delete_selected: "Ausgewählte löschen",
        recent_transactions: "Letzte Ausgaben",
        detailed_view: "Detailansicht",
        spending_breakdown: "Ausgabenübersicht",
        spending_trend: "Ausgabentrend",
        monthly_report: "Monatsbericht",
        total_spend: "Gesamtausgaben",
        top_category: "Top-Kategorie",
        transactions: "Transaktionen",
        avg_per_day: "Ø pro Tag",
        export_excel: "📥 In Excel exportieren",
        items_deleted: "Elemente gelöscht.",
        export_json: "🧩 JSON-Backup exportieren",
        import_json: "♻️ JSON-Backup importieren",
        reset_all: "Alle Daten zurücksetzen",
        all_transactions: "Alle Ausgaben",
        close: "Schließen",
        select_all: "Alle auswählen",
        cancel: "Abbrechen",
        show_advanced: "Erweiterte Optionen anzeigen",
        hide_advanced: "Erweiterte Optionen ausblenden",
        no_results: "Keine Ergebnisse gefunden.",
        no_data_yet: "Noch keine Daten.",
        no_spending_yesterday_today: "Gestern keine Ausgaben. Heute: {amount}",
        no_spending_today: "Heute keine Ausgaben.",
        today_vs_yesterday: "Heute vs. Gestern: {percent}",
        trip_ended: "Zeitraum beendet",
        top_prefix: "Top: {category}",
        alert_total_grant: "Bitte Gesamtbudget eingeben!",
        alert_select_currencies: "Bitte Währungen auswählen!",
        alert_invalid_amount: "Bitte einen gültigen Betrag eingeben!",
        alert_select_currency: "Bitte eine Währung auswählen!",
        alert_select_category: "Bitte Kategorie auswählen!",
        alert_setup_complete: "Setup abgeschlossen! Tracking gestartet. 🚀",
        alert_add_success: "Budget erfolgreich hinzugefügt!",
        alert_excel_failed: "Excel-Exportbibliothek konnte nicht geladen werden.",
        alert_delete_confirm: "{count} ausgewählte Elemente löschen?",
        alert_reset_confirm: "Bist du sicher? Alle Daten werden gelöscht!",
        alert_import_confirm: "Import ersetzt die aktuellen Daten. Fortfahren?",
        alert_import_invalid: "Ungültige Backup-Datei.",
        alert_import_failed: "Backup-Datei konnte nicht importiert werden."
    }
};

const VIBRANT_COLORS = [
    "#2563EB",
    "#F97316",
    "#10B981",
    "#8B5CF6",
    "#EF4444",
    "#14B8A6",
    "#EAB308",
    "#DB2777"
];

function getCategoryColor(category) {
    const map = {
        Food: "#F97316",
        Transport: "#2563EB",
        Entertainment: "#DB2777",
        Travel: "#8B5CF6",
        Investment: "#EAB308",
        Health: "#10B981",
        Other: "#94A3B8"
    };
    return map[category] || VIBRANT_COLORS[0];
}

function parseDateGB(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
}

function normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function ensureExpenseIds(expenses) {
    if (!Array.isArray(expenses)) return [];
    let updated = false;
    const stamp = Date.now();
    expenses.forEach((exp, index) => {
        if (!exp.id) {
            exp.id = `exp_${stamp}_${index}_${Math.random().toString(16).slice(2, 8)}`;
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    return expenses;
}

function getAllExpensesCount() {
    return ensureExpenseIds(JSON.parse(localStorage.getItem('expenses')) || []).length;
}

function getCategoryLabel(category) {
    const map = {
        Food: "cat_food",
        Transport: "cat_transport",
        Entertainment: "cat_entertainment",
        Travel: "cat_travel",
        Investment: "cat_investment",
        Health: "cat_health",
        Other: "cat_other"
    };
    const key = map[category];
    if (key) return t(key).replace(/^[^\w]+/u, "").trim();
    return category || '-';
}

function getCurrencySymbol(code) {
    const symbols = {
        EUR: '€',
        USD: '$',
        GBP: '£',
        TRY: '₺',
        RON: 'lei',
        PLN: 'zł',
        HUF: 'Ft',
        CZK: 'Kč',
        BGN: 'лв'
    };
    return symbols[code] || code;
}

function getFilterValues() {
    const search = (document.getElementById('filter-search')?.value || '').trim().toLowerCase();
    const fromValue = document.getElementById('filter-from')?.value || '';
    const toValue = document.getElementById('filter-to')?.value || '';
    const fromDate = fromValue ? normalizeDate(new Date(fromValue)) : null;
    const toDate = toValue ? normalizeDate(new Date(toValue)) : null;
    return { search, fromDate, toDate };
}

function t(key, vars = {}) {
    const dictionary = I18N[currentLanguage] || I18N.en;
    let text = dictionary[key] || I18N.en[key] || key;
    Object.keys(vars).forEach((name) => {
        text = text.replace(`{${name}}`, vars[name]);
    });
    return text;
}

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', t(key));
    });
    const weeklyTop = document.getElementById('weekly-top-category');
    const monthlyTop = document.getElementById('monthly-top-category');
    if (weeklyTop && weeklyTop.innerText.startsWith('Top')) {
        weeklyTop.innerText = t('top_prefix', { category: '-' });
    }
    if (monthlyTop && monthlyTop.innerText.startsWith('Top')) {
        monthlyTop.innerText = t('top_prefix', { category: '-' });
    }
    const advancedBtn = document.getElementById('advanced-toggle-btn');
    if (advancedBtn) {
        advancedBtn.innerText = isAdvancedVisible ? t('hide_advanced') : t('show_advanced');
    }
    const filterBtn = document.getElementById('filter-toggle-btn');
    if (filterBtn) {
        filterBtn.innerText = isFilterVisible ? t('hide_filters') : t('find_expense');
    }
    updateBulkActionsUI();
}


const doughnutDepthPlugin = {
    id: "doughnutDepthPlugin",
    beforeDatasetsDraw(chart) {
        if (chart.config.type !== "doughnut") return;
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data) return;

        ctx.save();
        ctx.translate(2, 3);
        ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
        meta.data.forEach((arc) => {
            ctx.beginPath();
            ctx.arc(arc.x, arc.y, arc.outerRadius, arc.startAngle, arc.endAngle);
            ctx.arc(arc.x, arc.y, arc.innerRadius, arc.endAngle, arc.startAngle, true);
            ctx.closePath();
            ctx.fill();
        });
        ctx.restore();
    },
    afterDatasetsDraw(chart) {
        if (chart.config.type !== "doughnut") return;
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data) return;

        const arc = meta.data[0];
        if (!arc) return;

        ctx.save();
        const gradient = ctx.createRadialGradient(arc.x, arc.y, arc.innerRadius, arc.x, arc.y, arc.outerRadius);
        gradient.addColorStop(0, "rgba(255,255,255,0.35)");
        gradient.addColorStop(0.7, "rgba(255,255,255,0.05)");
        gradient.addColorStop(1, "rgba(0,0,0,0.08)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(arc.x, arc.y, arc.outerRadius, 0, Math.PI * 2);
        ctx.arc(arc.x, arc.y, arc.innerRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
};

function setLanguage(lang) {
    currentLanguage = I18N[lang] ? lang : 'en';
    localStorage.setItem('language', currentLanguage);
    applyLanguage();
    renderApp();
}

function detectDeviceLanguage() {
    const deviceLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (deviceLang.startsWith('tr')) return 'tr';
    if (deviceLang.startsWith('de')) return 'de';
    return 'en';
}

// --- 1. KURULUM KAYDETME ---
function saveInitialSettings() {
    console.log("Start Tracking butonuna basıldı...");

    const grantInput = document.getElementById('total-grant');
    const dateInput = document.getElementById('end-date');
    const baseCurrInput = document.getElementById('base-currency');
    const targetCurrInput = document.getElementById('target-currency');

    const grant = grantInput ? grantInput.value : null;
    const date = dateInput ? dateInput.value : null;
    const baseCurr = baseCurrInput ? baseCurrInput.value : "";
    const targetCurr = targetCurrInput ? targetCurrInput.value : "";

    if (!grant) {
        alert(t('alert_total_grant'));
        return;
    }

    if (!baseCurr || !targetCurr) {
        alert(t('alert_select_currencies'));
        return;
    }

    try {
        localStorage.setItem('totalBudget', grant);
        localStorage.setItem('endDate', date || "");
        localStorage.setItem('baseCurrency', baseCurr);
        localStorage.setItem('targetCurrency', targetCurr);

        BASE_CURRENCY = baseCurr;
        TARGET_CURRENCY = targetCurr;

        if (!localStorage.getItem('expenses')) {
            localStorage.setItem('expenses', JSON.stringify([]));
        }

        const expenseCurrency = document.getElementById('expense-currency');
        const fundCurrency = document.getElementById('fund-currency');
        if (expenseCurrency) expenseCurrency.value = baseCurr;
        if (fundCurrency) fundCurrency.value = baseCurr;

        setSetupVisibility(false);
        getLiveExchangeRate(); 
        alert(t('alert_setup_complete'));
        
    } catch (error) {
        console.error("Kayıt hatası:", error);
        alert(`Error saving data: ${error.message}`);
    }
}

// --- 2. CANLI KUR ---
async function getLiveExchangeRate() {
    BASE_CURRENCY = localStorage.getItem('baseCurrency') || "EUR";
    TARGET_CURRENCY = localStorage.getItem('targetCurrency') || "TRY";

    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`);
        const data = await response.json();
        
        if (data && data.rates) {
            ALL_RATES = data.rates; 
            EXCHANGE_RATE = data.rates[TARGET_CURRENCY];
            console.log("Rates Updated:", ALL_RATES);
            renderApp(); 
        }
    } catch (error) {
        console.error("API Error:", error);
        renderApp(); 
    }
}

// --- 3. HARCAMA EKLEME ---
function addExpense() {
    const amountInput = document.getElementById('expense-amount');
    const currencyInput = document.getElementById('expense-currency'); 
    const categoryInput = document.getElementById('expense-category');
    const noteInput = document.getElementById('expense-note');
    
    let originalAmount = parseFloat(amountInput.value);
    const selectedCurrency = currencyInput.value;

    if (!originalAmount || originalAmount <= 0) {
        alert(t('alert_invalid_amount'));
        return;
    }

    if (!selectedCurrency) {
        alert(t('alert_select_currency'));
        return;
    }

    if (categoryInput.value === "") {
        alert(t('alert_select_category'));
        return;
    }

    let amountInBase = originalAmount;
    if (selectedCurrency !== BASE_CURRENCY) {
        const rate = ALL_RATES[selectedCurrency] || 1;
        amountInBase = originalAmount / rate;
    }

    const newExpense = {
        id: `exp_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
        amount: amountInBase, 
        originalAmount: originalAmount, 
        currency: selectedCurrency, 
        category: categoryInput.value,
        note: noteInput ? noteInput.value.trim() : "",
        date: new Date().toLocaleDateString('en-GB')
    };

    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    amountInput.value = ''; 
    document.getElementById('expense-category').value = ''; 
    if (noteInput) noteInput.value = '';
    renderApp();
}

// --- 4. EKRANI GÜNCELLEME ---
function renderApp() {
    const baseSym = getCurrencySymbol(BASE_CURRENCY);
    const targetSym = getCurrencySymbol(TARGET_CURRENCY);
    const currentRate = ALL_RATES[TARGET_CURRENCY] || 1;

    const budget = parseFloat(localStorage.getItem('totalBudget'));
    const endDateStr = localStorage.getItem('endDate');
    
    if (!budget) {
        setSetupVisibility(true);
        updateInitialBudgetDisplay("-");
        return;
    }

    const expenses = ensureExpenseIds(JSON.parse(localStorage.getItem('expenses')) || []);
    const totalSpent = expenses.reduce((sum, curr) => sum + parseFloat(curr.amount), 0);
    const remaining = budget - totalSpent;
    setSetupVisibility(remaining <= 0);
    updateInitialBudgetDisplay(`${baseSym}${budget.toFixed(2)}`);

    const today = new Date(); today.setHours(0,0,0,0);
    let diffDays = null;
    if (endDateStr) {
        const endDate = new Date(endDateStr);
        diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    }
    
    document.getElementById('total-remaining-eur').innerText = `${baseSym}${remaining.toFixed(2)}`;
    document.getElementById('total-remaining-try').innerText = `(${ (remaining * currentRate).toFixed(2) } ${targetSym})`;

    if (!endDateStr) {
        setDailyLimitVisibility(false);
    } else if (diffDays && diffDays > 0) {
        setDailyLimitVisibility(true);
        const safe = remaining / diffDays;
        document.getElementById('daily-limit-display').innerText = `${baseSym}${safe.toFixed(2)}`;
        document.getElementById('daily-limit-try').innerText = `(${ (safe * currentRate).toFixed(2) } ${targetSym})`;
    } else {
        setDailyLimitVisibility(true);
        document.getElementById('daily-limit-display').innerText = t('trip_ended');
        document.getElementById('daily-limit-try').innerText = "-";
    }

    updateSummary(expenses, baseSym);
    updateMonthlyReport(expenses);
    applyFilters(expenses);
}

function setSetupVisibility(show) {
    const setupArea = document.getElementById('setup-area');
    if (setupArea) setupArea.style.display = show ? 'block' : 'none';
}

function setDailyLimitVisibility(show) {
    const section = document.getElementById('daily-limit-section');
    if (section) section.style.display = show ? 'block' : 'none';
}

function updateInitialBudgetDisplay(text) {
    const el = document.getElementById('initial-budget');
    if (el) el.innerText = `Initial budget: ${text}`;
}

// --- 5. LİSTELEME & FİLTRELEME ---
function applyFilters(expenses) {
    const list = expenses || ensureExpenseIds(JSON.parse(localStorage.getItem('expenses')) || []);
    const filtered = filterExpenses(list);
    latestFilteredExpenses = filtered;
    renderList(filtered);
    updateChart(filtered);
    updateTrendChart(filtered);
    updateBulkActionsUI();
}

function filterExpenses(expenses) {
    let filtered = expenses;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(exp => exp.category === currentCategory);
    }

    const { search, fromDate, toDate } = getFilterValues();
    if (search) {
        filtered = filtered.filter(exp => {
            const note = (exp.note || '').toLowerCase();
            const category = (exp.category || '').toLowerCase();
            return category.includes(search) || note.includes(search);
        });
    }

    if (fromDate || toDate) {
        filtered = filtered.filter(exp => {
            const expDate = parseDateGB(exp.date);
            if (!expDate) return false;
            const normalized = normalizeDate(expDate);
            if (fromDate && normalized < fromDate) return false;
            if (toDate && normalized > toDate) return false;
            return true;
        });
    }

    return filtered;
}

function filterList(category) {
    currentCategory = category;
    updateFilterButtons();
    applyFilters();
}

function updateFilterButtons() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        const isActive = btn.dataset.category === currentCategory;
        if (isActive) {
            btn.classList.add('active');
            btn.style.background = '#4f46e5';
            btn.style.color = 'white';
            btn.style.border = 'none';
        } else {
            btn.classList.remove('active');
            btn.style.background = '#f3f4f6';
            btn.style.color = '#333';
            btn.style.border = '1px solid #ddd';
        }
    });
}

function renderList(expenses) {
    const listElement = document.getElementById('expense-list');
    listElement.innerHTML = '';

    const baseSym = getCurrencySymbol(BASE_CURRENCY);

    if (!expenses.length) {
        const empty = document.createElement('li');
        empty.style.cssText = "background:white; padding:12px; border-radius:10px; text-align:center; color:#94a3b8;";
        empty.innerText = t('no_results');
        listElement.appendChild(empty);
        return;
    }

    expenses.slice().reverse().forEach((exp) => {
        const displayAmount = exp.originalAmount || exp.amount; 
        const displayCurr = exp.currency || BASE_CURRENCY;
        const displaySym = getCurrencySymbol(displayCurr);
        const noteText = exp.note ? `<div style="font-size:0.75rem; color:#64748b; margin-top:2px;">${exp.note}</div>` : "";
        const checkedAttr = selectedExpenseIds.has(exp.id) ? "checked" : "";

        const li = document.createElement('li');
        li.style.cssText = "background:white; margin-bottom:10px; padding:15px; border-radius:12px; box-shadow:0 2px 5px rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center; gap:10px;";
        
        li.innerHTML = `
            <div style="display:flex; gap:10px; align-items:flex-start;">
                <input type="checkbox" class="expense-select" data-id="${exp.id}" ${checkedAttr} style="margin-top:3px;">
                <div>
                    <span style="font-size:0.75rem; color:#999;">${exp.date}</span>
                    <div style="font-weight:600; color:#333;">${getCategoryLabel(exp.category)}</div>
                    ${noteText}
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-weight:bold; color:#1e3c72;">${displaySym}${parseFloat(displayAmount).toFixed(2)}</div>
                <div style="font-size:0.75rem; color:#7f8c8d;">≈ ${baseSym}${exp.amount.toFixed(2)}</div>
            </div>
        `;
        listElement.appendChild(li);
    });

    const checkboxes = listElement.querySelectorAll('.expense-select');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const id = event.target.dataset.id;
            if (event.target.checked) {
                selectedExpenseIds.add(id);
            } else {
                selectedExpenseIds.delete(id);
            }
            updateBulkActionsUI();
            if (isDetailModalOpen) renderFullList();
        });
    });
}

function renderFullList() {
    const listElement = document.getElementById('full-expense-list');
    if (!listElement) return;
    listElement.innerHTML = '';

    const expenses = ensureExpenseIds(JSON.parse(localStorage.getItem('expenses')) || []);
    const baseSym = getCurrencySymbol(BASE_CURRENCY);

    if (!expenses.length) {
        const empty = document.createElement('li');
        empty.style.cssText = "background:white; padding:12px; border-radius:10px; text-align:center; color:#94a3b8;";
        empty.innerText = t('no_results');
        listElement.appendChild(empty);
        return;
    }

    expenses.slice().reverse().forEach((exp) => {
        const displayAmount = exp.originalAmount || exp.amount; 
        const displayCurr = exp.currency || BASE_CURRENCY;
        const displaySym = getCurrencySymbol(displayCurr);
        const noteText = exp.note ? `<div style="font-size:0.75rem; color:#64748b; margin-top:2px;">${exp.note}</div>` : "";
        const checkedAttr = selectedExpenseIds.has(exp.id) ? "checked" : "";

        const li = document.createElement('li');
        li.style.cssText = "background:white; margin-bottom:10px; padding:15px; border-radius:12px; box-shadow:0 2px 5px rgba(0,0,0,0.05); display:flex; justify-content:space-between; align-items:center; gap:10px;";
        
        li.innerHTML = `
            <div style="display:flex; gap:10px; align-items:flex-start;">
                <input type="checkbox" class="expense-select" data-id="${exp.id}" ${checkedAttr} style="margin-top:3px;">
                <div>
                    <span style="font-size:0.75rem; color:#999;">${exp.date}</span>
                    <div style="font-weight:600; color:#333;">${getCategoryLabel(exp.category)}</div>
                    ${noteText}
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-weight:bold; color:#1e3c72;">${displaySym}${parseFloat(displayAmount).toFixed(2)}</div>
                <div style="font-size:0.75rem; color:#7f8c8d;">≈ ${baseSym}${exp.amount.toFixed(2)}</div>
            </div>
        `;
        listElement.appendChild(li);
    });

    const checkboxes = listElement.querySelectorAll('.expense-select');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const id = event.target.dataset.id;
            if (event.target.checked) {
                selectedExpenseIds.add(id);
            } else {
                selectedExpenseIds.delete(id);
            }
            updateBulkActionsUI();
        });
    });
}

// --- 6. GRAFİKLER ---
function updateChart(expenses) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const categories = {};
    expenses.forEach(exp => {
        if (categories[exp.category]) {
            categories[exp.category] += parseFloat(exp.amount);
        } else {
            categories[exp.category] = parseFloat(exp.amount);
        }
    });

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories).map(getCategoryLabel),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: Object.keys(categories).map(getCategoryColor),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            layout: { padding: { top: 8, bottom: 28, left: 8, right: 8 } },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 10 } }
                },
                cutout: '68%'
            }
        },
        plugins: [doughnutDepthPlugin]
    });
}

function getWeekMonthSummary(expenses) {
    const today = normalizeDate(new Date());
    const day = today.getDay();
    const diff = (day + 6) % 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - diff);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const weekExpenses = expenses.filter(exp => {
        const expDate = parseDateGB(exp.date);
        if (!expDate) return false;
        const normalized = normalizeDate(expDate);
        return normalized >= startOfWeek && normalized <= today;
    });

    const monthExpenses = expenses.filter(exp => {
        const expDate = parseDateGB(exp.date);
        if (!expDate) return false;
        const normalized = normalizeDate(expDate);
        return normalized >= startOfMonth && normalized <= today;
    });

    return {
        weekTotal: weekExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
        monthTotal: monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0),
        weekTop: getTopCategory(weekExpenses),
        monthTop: getTopCategory(monthExpenses)
    };
}

function updateSummary(expenses, baseSym) {
    const summary = getWeekMonthSummary(expenses);

    const weeklyTotalEl = document.getElementById('weekly-total');
    const monthlyTotalEl = document.getElementById('monthly-total');
    const weeklyTopEl = document.getElementById('weekly-top-category');
    const monthlyTopEl = document.getElementById('monthly-top-category');

    if (weeklyTotalEl) weeklyTotalEl.innerText = `${baseSym}${summary.weekTotal.toFixed(2)}`;
    if (monthlyTotalEl) monthlyTotalEl.innerText = `${baseSym}${summary.monthTotal.toFixed(2)}`;
    if (weeklyTopEl) weeklyTopEl.innerText = t('top_prefix', { category: summary.weekTop });
    if (monthlyTopEl) monthlyTopEl.innerText = t('top_prefix', { category: summary.monthTop });
}

function getTopCategory(expenses) {
    if (!expenses.length) return '-';
    const totals = {};
    expenses.forEach(exp => {
        totals[exp.category] = (totals[exp.category] || 0) + parseFloat(exp.amount);
    });
    let topCategory = '-';
    let maxTotal = -Infinity;
    Object.keys(totals).forEach(category => {
        if (totals[category] > maxTotal) {
            maxTotal = totals[category];
            topCategory = getCategoryLabel(category);
        }
    });
    return topCategory;
}

function updateTrendChart(expenses) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    const compareEl = document.getElementById('trend-compare');
    const baseSym = getCurrencySymbol(BASE_CURRENCY);

    const totalsByDay = {};
    expenses.forEach(exp => {
        const expDate = parseDateGB(exp.date);
        if (!expDate) return;
        const normalized = normalizeDate(expDate);
        const key = normalized.toISOString().slice(0, 10);
        totalsByDay[key] = (totalsByDay[key] || 0) + parseFloat(exp.amount);
    });

    const today = normalizeDate(new Date());
    const days = 14;
    const labels = [];
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        labels.push(d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }));
        data.push(parseFloat((totalsByDay[key] || 0).toFixed(2)));
    }

    const todayKey = today.toISOString().slice(0, 10);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    const todayTotal = totalsByDay[todayKey] || 0;
    const yesterdayTotal = totalsByDay[yesterdayKey] || 0;

    if (compareEl) {
        if (!expenses.length) {
            compareEl.innerText = t('no_data_yet');
        } else if (yesterdayTotal === 0) {
            compareEl.innerText = todayTotal > 0
                ? t('no_spending_yesterday_today', { amount: `${baseSym}${todayTotal.toFixed(2)}` })
                : t('no_spending_today');
        } else {
            const change = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
            const sign = change >= 0 ? "+" : "";
            compareEl.innerText = t('today_vs_yesterday', { percent: `${sign}${change.toFixed(1)}%` });
        }
    }

    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Daily Spend',
                data,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
                fill: true,
                tension: 0.35,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => `${baseSym}${value}`
                    }
                }
            }
        }
    });
}

function updateMonthlyReport(expenses) {
    const monthInput = document.getElementById('report-month');
    if (!monthInput) return;

    const now = new Date();
    if (!monthInput.value) {
        const monthValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        monthInput.value = monthValue;
    }

    const [yearStr, monthStr] = monthInput.value.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;
    if (Number.isNaN(year) || Number.isNaN(monthIndex)) return;

    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0);
    const daysInMonth = end.getDate();

    const monthExpenses = expenses.filter(exp => {
        const expDate = parseDateGB(exp.date);
        if (!expDate) return false;
        const normalized = normalizeDate(expDate);
        return normalized >= start && normalized <= end;
    });

    const total = monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const topCategory = getTopCategory(monthExpenses);
    const count = monthExpenses.length;
    const avgDaily = daysInMonth ? total / daysInMonth : 0;

    const baseSym = getCurrencySymbol(BASE_CURRENCY);
    const totalEl = document.getElementById('report-total');
    const topEl = document.getElementById('report-top-category');
    const countEl = document.getElementById('report-count');
    const avgEl = document.getElementById('report-avg-daily');

    if (totalEl) totalEl.innerText = `${baseSym}${total.toFixed(2)}`;
    if (topEl) topEl.innerText = topCategory;
    if (countEl) countEl.innerText = `${count}`;
    if (avgEl) avgEl.innerText = `${baseSym}${avgDaily.toFixed(2)}`;

    const dailyTotals = Array.from({ length: daysInMonth }, () => 0);
    monthExpenses.forEach(exp => {
        const expDate = parseDateGB(exp.date);
        if (!expDate) return;
        const dayIndex = expDate.getDate() - 1;
        dailyTotals[dayIndex] += parseFloat(exp.amount);
    });

    const labels = dailyTotals.map((_, index) => String(index + 1));
    const ctx = document.getElementById('monthlyChart').getContext('2d');

    if (monthlyChart) {
        monthlyChart.destroy();
    }

    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Daily Spend',
                data: dailyTotals.map(value => parseFloat(value.toFixed(2))),
                backgroundColor: 'rgba(14, 165, 164, 0.25)',
                borderColor: '#0ea5a4',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => `${baseSym}${value}`
                    }
                }
            }
        }
    });

    updateMonthlyCategoryChart(monthExpenses);
}

function updateBulkActionsUI() {
    const countEl = document.getElementById('selected-count');
    const deleteBtn = document.getElementById('delete-selected');
    const undoBtn = document.getElementById('undo-delete');
    const countModal = document.getElementById('selected-count-modal');
    const deleteModal = document.getElementById('delete-selected-modal');
    const undoModal = document.getElementById('undo-delete-modal');
    const selectBtn = document.getElementById('select-all-btn');
    const selectModalBtn = document.getElementById('select-all-modal-btn');
    const count = selectedExpenseIds.size;
    const totalCount = getAllExpensesCount();
    const allSelected = totalCount > 0 && count >= totalCount;
    if (countEl) countEl.innerText = `${count} selected`;
    if (deleteBtn) deleteBtn.disabled = count === 0;
    if (undoBtn) undoBtn.disabled = !lastDeletedSnapshot;
    if (countModal) countModal.innerText = `${count} selected`;
    if (deleteModal) deleteModal.disabled = count === 0;
    if (undoModal) undoModal.disabled = !lastDeletedSnapshot;
    if (selectBtn) selectBtn.innerText = allSelected ? t('cancel') : t('select_all');
    if (selectModalBtn) selectModalBtn.innerText = allSelected ? t('cancel') : t('select_all');
}

function updateMonthlyCategoryChart(expenses) {
    const ctx = document.getElementById('monthlyCategoryChart').getContext('2d');
    const categories = {};
    expenses.forEach(exp => {
        categories[exp.category] = (categories[exp.category] || 0) + parseFloat(exp.amount);
    });

    const labels = Object.keys(categories);
    const values = labels.map(key => parseFloat(categories[key].toFixed(2)));

    if (monthlyCategoryChart) {
        monthlyCategoryChart.destroy();
    }

    monthlyCategoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map(getCategoryLabel),
            datasets: [{
                data: values,
                backgroundColor: labels.map(getCategoryColor),
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            layout: { padding: { top: 8, bottom: 28, left: 8, right: 8 } },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 10 } }
                },
                cutout: '68%'
            }
        },
        plugins: [doughnutDepthPlugin]
    });
}

function selectVisibleExpenses() {
    latestFilteredExpenses.forEach(exp => selectedExpenseIds.add(exp.id));
    applyFilters();
    if (isDetailModalOpen) renderFullList();
}

function clearSelectedExpenses() {
    selectedExpenseIds.clear();
    applyFilters();
    if (isDetailModalOpen) renderFullList();
}

function selectAllExpenses() {
    const totalCount = getAllExpensesCount();
    const allSelected = totalCount > 0 && selectedExpenseIds.size >= totalCount;
    if (allSelected) {
        clearSelectedExpenses();
        return;
    }
    const expenses = ensureExpenseIds(JSON.parse(localStorage.getItem('expenses')) || []);
    expenses.forEach(exp => selectedExpenseIds.add(exp.id));
    applyFilters();
    if (isDetailModalOpen) renderFullList();
}

function deleteSelectedExpenses() {
    if (!selectedExpenseIds.size) return;
    if (!confirm(t('alert_delete_confirm', { count: selectedExpenseIds.size }))) {
        return;
    }
    const expenses = ensureExpenseIds(JSON.parse(localStorage.getItem('expenses')) || []);
    lastDeletedSnapshot = expenses;
    const remaining = expenses.filter(exp => !selectedExpenseIds.has(exp.id));
    localStorage.setItem('expenses', JSON.stringify(remaining));
    selectedExpenseIds.clear();
    showUndoBar();
    renderApp();
    if (isDetailModalOpen) renderFullList();
}

function showUndoBar() {
    const undoBar = document.getElementById('undo-bar');
    if (!undoBar) return;
    undoBar.style.display = 'flex';
    if (undoTimer) clearTimeout(undoTimer);
    updateBulkActionsUI();
    undoTimer = setTimeout(() => {
        hideUndoBar();
        lastDeletedSnapshot = null;
        updateBulkActionsUI();
    }, 8000);
}

function hideUndoBar() {
    const undoBar = document.getElementById('undo-bar');
    if (undoBar) undoBar.style.display = 'none';
    if (undoTimer) {
        clearTimeout(undoTimer);
        undoTimer = null;
    }
    updateBulkActionsUI();
}

function undoDeleteExpenses() {
    if (!lastDeletedSnapshot) return;
    localStorage.setItem('expenses', JSON.stringify(lastDeletedSnapshot));
    lastDeletedSnapshot = null;
    hideUndoBar();
    renderApp();
    if (isDetailModalOpen) renderFullList();
}

function openDetailedView() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.style.display = 'flex';
    isDetailModalOpen = true;
    renderFullList();
    updateBulkActionsUI();
}

function closeDetailedView() {
    const modal = document.getElementById('detail-modal');
    if (modal) modal.style.display = 'none';
    isDetailModalOpen = false;
}

function toggleAdvancedSection() {
    isAdvancedVisible = !isAdvancedVisible;
    const top = document.getElementById('advanced-top');
    const bottom = document.getElementById('advanced-bottom');
    const btn = document.getElementById('advanced-toggle-btn');
    if (top) top.style.display = isAdvancedVisible ? 'block' : 'none';
    if (bottom) bottom.style.display = isAdvancedVisible ? 'block' : 'none';
    if (btn) btn.innerText = isAdvancedVisible ? t('hide_advanced') : t('show_advanced');
    if (!isAdvancedVisible) clearSelectedExpenses();
}

function toggleSearchFilters() {
    isFilterVisible = !isFilterVisible;
    const filterTools = document.getElementById('filter-tools');
    const filterBtn = document.getElementById('filter-toggle-btn');
    if (filterTools) filterTools.style.display = isFilterVisible ? 'grid' : 'none';
    if (filterBtn) filterBtn.innerText = isFilterVisible ? t('hide_filters') : t('find_expense');
}

// --- 7. BAKİYE EKLEME ---
function toggleFundsArea() {
    const area = document.getElementById('add-funds-container');
    area.style.display = (area.style.display === 'none') ? 'block' : 'none';
}

function confirmAddFunds() {
    const amountInput = document.getElementById('fund-amount');
    const currencyInput = document.getElementById('fund-currency');
    let addedAmount = parseFloat(amountInput.value);
    const selectedCurrency = currencyInput.value;

    if (!addedAmount || addedAmount <= 0) {
        alert(t('alert_invalid_amount')); return;
    }

    if (!selectedCurrency) {
        alert(t('alert_select_currency')); return;
    }

    let finalAmount = addedAmount;
    if (selectedCurrency !== BASE_CURRENCY) {
        const rate = ALL_RATES[selectedCurrency] || 1;
        finalAmount = addedAmount / rate;
    }

    let currentBudget = parseFloat(localStorage.getItem('totalBudget')) || 0;
    localStorage.setItem('totalBudget', currentBudget + finalAmount);
    
    amountInput.value = '';
    toggleFundsArea();
    renderApp();
    alert(t('alert_add_success'));
}

// --- 8. EXPORT & RESET ---
async function exportToExcel() {
    if (!window.ExcelJS) {
        alert(t('alert_excel_failed'));
        return;
    }

    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const budget = parseFloat(localStorage.getItem('totalBudget')) || 0;
    const totalSpent = expenses.reduce((sum, curr) => sum + parseFloat(curr.amount), 0);
    const remaining = budget - totalSpent;
    const endDateStr = localStorage.getItem('endDate') || "";
    const summary = getWeekMonthSummary(expenses);
    const numberFormat = "#,##0.00";

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Budget Management";
    workbook.created = new Date();

    const expensesSheet = workbook.addWorksheet("Expenses");
    expensesSheet.columns = [
        { header: "Date", key: "date", width: 12 },
        { header: "Category", key: "category", width: 18 },
        { header: "Note", key: "note", width: 30 },
        { header: "Original Amount", key: "origAmount", width: 16 },
        { header: "Original Currency", key: "origCurrency", width: 16 },
        { header: "Base Amount", key: "baseAmount", width: 14 },
        { header: "Base Currency", key: "baseCurrency", width: 12 }
    ];
    expensesSheet.addRows(expenses.map(exp => ({
        date: exp.date,
        category: getCategoryLabel(exp.category),
        note: exp.note || "",
        origAmount: exp.originalAmount || exp.amount,
        origCurrency: exp.currency || BASE_CURRENCY,
        baseAmount: parseFloat(exp.amount.toFixed(2)),
        baseCurrency: BASE_CURRENCY
    })));
    styleHeaderRow(expensesSheet);
    expensesSheet.getColumn("origAmount").numFmt = numberFormat;
    expensesSheet.getColumn("baseAmount").numFmt = numberFormat;

    const dashboardSheet = workbook.addWorksheet("Dashboard");
    dashboardSheet.columns = [
        { width: 34 }, { width: 24 }, { width: 14 }
    ];
    dashboardSheet.addRows([
        ["Budget Management Dashboard"],
        ["Generated At", new Date().toLocaleString("en-GB")],
        [""],
        ["Total Budget", budget, BASE_CURRENCY],
        ["Total Spent", totalSpent, BASE_CURRENCY],
        ["Remaining", remaining, BASE_CURRENCY],
        ["End Date", endDateStr || "-", ""],
        [""],
        ["Weekly Total", summary.weekTotal, BASE_CURRENCY],
        ["Weekly Top Category", summary.weekTop, ""],
        ["Monthly Total", summary.monthTotal, BASE_CURRENCY],
        ["Monthly Top Category", summary.monthTop, ""]
    ]);
    dashboardSheet.getRow(1).font = { size: 16, bold: true };
    dashboardSheet.getColumn(2).numFmt = numberFormat;

    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.columns = [
        { header: "Metric", key: "metric", width: 24 },
        { header: "Value", key: "value", width: 18 },
        { header: "Currency", key: "currency", width: 12 }
    ];
    summarySheet.addRows([
        { metric: "Total Budget", value: budget, currency: BASE_CURRENCY },
        { metric: "Total Spent", value: totalSpent, currency: BASE_CURRENCY },
        { metric: "Remaining", value: remaining, currency: BASE_CURRENCY },
        { metric: "End Date", value: endDateStr || "-", currency: "" },
        { metric: "Weekly Total", value: summary.weekTotal, currency: BASE_CURRENCY },
        { metric: "Weekly Top Category", value: summary.weekTop, currency: "" },
        { metric: "Monthly Total", value: summary.monthTotal, currency: BASE_CURRENCY },
        { metric: "Monthly Top Category", value: summary.monthTop, currency: "" },
        { metric: "Generated At", value: new Date().toLocaleString("en-GB"), currency: "" }
    ]);
    styleHeaderRow(summarySheet);
    summarySheet.getColumn("value").numFmt = numberFormat;

    const categoryTotals = {};
    const categoryCounts = {};
    expenses.forEach(exp => {
        const category = exp.category || "Other";
        categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(exp.amount);
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const categoryRows = Object.keys(categoryTotals)
        .map(category => ({
            category: getCategoryLabel(category),
            totalSpent: parseFloat(categoryTotals[category].toFixed(2)),
            transactions: categoryCounts[category],
            currency: BASE_CURRENCY
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent);

    const categorySheet = workbook.addWorksheet("Category Analysis");
    categorySheet.columns = [
        { header: "Category", key: "category", width: 20 },
        { header: "Total Spent", key: "totalSpent", width: 16 },
        { header: "Transactions", key: "transactions", width: 14 },
        { header: "Currency", key: "currency", width: 12 }
    ];
    categorySheet.addRows(categoryRows);
    styleHeaderRow(categorySheet);
    categorySheet.getColumn("totalSpent").numFmt = numberFormat;

    const dailyTotals = {};
    expenses.forEach(exp => {
        const expDate = parseDateGB(exp.date);
        if (!expDate) return;
        const key = normalizeDate(expDate).toISOString().slice(0, 10);
        dailyTotals[key] = (dailyTotals[key] || 0) + parseFloat(exp.amount);
    });

    const dailyRows = Object.keys(dailyTotals)
        .sort()
        .map(key => ({
            date: key,
            totalSpent: parseFloat(dailyTotals[key].toFixed(2)),
            currency: BASE_CURRENCY
        }));

    const dailySheet = workbook.addWorksheet("Daily Trend");
    dailySheet.columns = [
        { header: "Date", key: "date", width: 12 },
        { header: "Total Spent", key: "totalSpent", width: 16 },
        { header: "Currency", key: "currency", width: 12 }
    ];
    dailySheet.addRows(dailyRows);
    styleHeaderRow(dailySheet);
    dailySheet.getColumn("totalSpent").numFmt = numberFormat;

    const chartSheet = workbook.addWorksheet("Chart Data");
    chartSheet.columns = [
        { header: "Category", key: "category", width: 20 },
        { header: "Total Spent", key: "totalSpent", width: 16 },
        { header: "Currency", key: "currency", width: 12 }
    ];
    chartSheet.addRows(categoryRows);
    chartSheet.addRow([]);
    chartSheet.addRow(["Daily Trend (Last 30 Days)"]);
    chartSheet.addRow(["Date", "Total Spent", "Currency"]);

    const today = normalizeDate(new Date());
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        chartSheet.addRow([key, parseFloat((dailyTotals[key] || 0).toFixed(2)), BASE_CURRENCY]);
    }
    chartSheet.getColumn(2).numFmt = numberFormat;

    const buffer = await workbook.xlsx.writeBuffer();
    downloadExcelFile(buffer, "budget_management.xlsx");
}

function styleHeaderRow(sheet) {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 20;
}

function downloadExcelFile(buffer, filename) {
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function exportToJSON() {
    const payload = {
        totalBudget: localStorage.getItem('totalBudget') || "",
        endDate: localStorage.getItem('endDate') || "",
        baseCurrency: localStorage.getItem('baseCurrency') || BASE_CURRENCY,
        targetCurrency: localStorage.getItem('targetCurrency') || TARGET_CURRENCY,
        expenses: ensureExpenseIds(JSON.parse(localStorage.getItem('expenses')) || [])
    };
    const fileName = `budget_management_backup_${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function triggerJSONImport() {
    const input = document.getElementById('import-json-input');
    if (input) input.click();
}

function handleJSONImport(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            const confirmed = confirm(t('alert_import_confirm'));
            if (!confirmed) return;

            let expenses = [];
            let totalBudget = localStorage.getItem('totalBudget') || "";
            let endDate = localStorage.getItem('endDate') || "";
            let baseCurrency = localStorage.getItem('baseCurrency') || BASE_CURRENCY;
            let targetCurrency = localStorage.getItem('targetCurrency') || TARGET_CURRENCY;

            if (Array.isArray(data)) {
                expenses = data;
            } else if (data && typeof data === "object") {
                expenses = data.expenses || [];
                totalBudget = data.totalBudget || totalBudget;
                endDate = data.endDate || endDate;
                baseCurrency = data.baseCurrency || baseCurrency;
                targetCurrency = data.targetCurrency || targetCurrency;
            } else {
                alert(t('alert_import_invalid'));
                return;
            }

            localStorage.setItem('totalBudget', totalBudget);
            localStorage.setItem('endDate', endDate || "");
            localStorage.setItem('baseCurrency', baseCurrency);
            localStorage.setItem('targetCurrency', targetCurrency);
            localStorage.setItem('expenses', JSON.stringify(ensureExpenseIds(expenses)));

            const baseSelect = document.getElementById('base-currency');
            const targetSelect = document.getElementById('target-currency');
            if (baseSelect) baseSelect.value = baseCurrency;
            if (targetSelect) targetSelect.value = targetCurrency;

            const expenseCurrency = document.getElementById('expense-currency');
            const fundCurrency = document.getElementById('fund-currency');
            if (expenseCurrency) expenseCurrency.value = baseCurrency;
            if (fundCurrency) fundCurrency.value = baseCurrency;

            getLiveExchangeRate();
        } catch (error) {
            alert(t('alert_import_failed'));
        }
    };
    reader.readAsText(file);
}


function resetApp() {
    if(confirm(t('alert_reset_confirm'))) {
        localStorage.clear();
        location.reload();
    }
}

// --- BAŞLANGIÇ ---
window.onload = () => {
    const searchInput = document.getElementById('filter-search');
    const fromInput = document.getElementById('filter-from');
    const toInput = document.getElementById('filter-to');
    const reportMonthInput = document.getElementById('report-month');
    const importInput = document.getElementById('import-json-input');
    const languageSelect = document.getElementById('language-select');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (fromInput) fromInput.addEventListener('change', applyFilters);
    if (toInput) toInput.addEventListener('change', applyFilters);
    if (reportMonthInput) reportMonthInput.addEventListener('change', () => {
        updateMonthlyReport(ensureExpenseIds(JSON.parse(localStorage.getItem('expenses')) || []));
    });
    if (importInput) importInput.addEventListener('change', (event) => {
        const file = event.target.files && event.target.files[0];
        if (file) handleJSONImport(file);
        event.target.value = "";
    });
    if (languageSelect) {
        const saved = localStorage.getItem('language');
        const initial = saved || detectDeviceLanguage();
        languageSelect.value = initial;
        currentLanguage = initial;
        languageSelect.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }

    updateFilterButtons();
    applyLanguage();
    getLiveExchangeRate();
};