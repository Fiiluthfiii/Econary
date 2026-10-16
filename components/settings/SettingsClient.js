'use client';

import { useEffect, useState } from 'react';
import { Bell, Camera, Check, CheckCircle, Lock, Mail, Phone, Save, Trash2, User, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function SettingsClient({ user }) {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: '', bio: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({ budget: true, transaction: true, email: true, universe: true });
  const [preferences, setPreferences] = useState({ currency: 'IDR', language: 'id', dark: false, dateFormat: 'DD/MM/YYYY' });

  const notify = (type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: '', text: '' }), 2500);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        if (data.user) {
          setProfile({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            bio: data.user.bio || ''
          });
        }
      } catch (error) {
        console.error(error);
      }
    })();

    const dark = localStorage.getItem('darkMode') === 'true';
    setPreferences({
      currency: localStorage.getItem('currency') || 'IDR',
      language: localStorage.getItem('language') || 'id',
      dateFormat: localStorage.getItem('dateFormat') || 'DD/MM/YYYY',
      dark
    });
  }, []);

  const uploadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal memperbarui profil');

      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
          email: data.user.email
        }
      });

      notify('success', 'Profil berhasil diperbarui.');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      return notify('error', 'Konfirmasi password tidak cocok.');
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: password.currentPassword,
          newPassword: password.newPassword
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal mengubah password');

      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      notify('success', 'Password berhasil diperbarui.');
    } catch (error) {
      notify('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = (key, value) => {
    setNotifications((current) => ({ ...current, [key]: value }));
  };

  const savePreferences = () => {
    localStorage.setItem('currency', preferences.currency);
    localStorage.setItem('language', preferences.language);
    localStorage.setItem('dateFormat', preferences.dateFormat);
    localStorage.setItem('darkMode', String(preferences.dark));
    document.documentElement.classList.toggle('dark', preferences.dark);
    window.dispatchEvent(new Event('preferencesChanged'));
    notify('success', 'Preferensi berhasil disimpan.');
  };

  const deleteAccount = async () => {
    if (!deletePassword) return notify('error', 'Password diperlukan.');
    setLoading(true);
    const response = await fetch('/api/user/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: deletePassword })
    });
    const data = await response.json();
    if (!response.ok) {
      notify('error', data.message || 'Gagal menghapus akun.');
      setLoading(false);
      return;
    }
    window.location.href = '/login';
  };

  const now = new Date();
  const userName = profile.name || user?.name || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="finverse-page settings-page">
      <header className="finverse-topbar settings-topbar">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="greeting">Halo, {userName.split(' ')[0]}!</h1>
            <span className="sync-pill">● PostgreSQL Synced</span>
          </div>
          <p className="date-line">{format(now, 'EEEE, dd MMMM yyyy', { locale: id })}</p>
        </div>
        <div className="header-actions">
          <button className="finverse-primary-button" onClick={() => notify('success', 'Gunakan halaman transaksi untuk mencatat transaksi.')}>
            <span>＋</span> Catat Transaksi
          </button>
          <div className="avatar">{userInitials}</div>
        </div>
      </header>

      <div className="settings-context">● PUSAT AKUN &amp; KEAMANAN • SKPL FR-01, FR-02, FR-03</div>

      <section className="settings-heading">
        <div>
          <h2>Pengaturan Akun &amp; Profil</h2>
          <p>
            Kelola identitas personal, preferensi persona multi-role, preferensi mata uang &amp; format laporan, serta
            <br className="desktop-only" /> keamanan autentikasi PostgreSQL.
          </p>
        </div>
        <div className="settings-actions">
          <button className="soft-action" onClick={() => window.location.reload()}>Batal</button>
          <button className="finverse-primary-button" onClick={savePreferences}>
            <Check size={14} /> Simpan Perubahan
          </button>
        </div>
      </section>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          <CheckCircle size={16} /> {message.text}
        </div>
      )}

      <div className="settings-grid">
        <main>
          {/* Profile Settings */}
          <section className="settings-card profile-settings">
            <CardHeading
              icon={<User size={18} />}
              title="Profil Personal & Persona Finansial"
              subtitle="Konfigurasi representasi identitas dan konteks analitik Econary Anda"
              badge="SKPL FR-01 Ready"
            />
            <form onSubmit={updateProfile}>
              <div className="profile-banner">
                <div className="profile-image">
                  {image ? <img src={image} alt="Profil" /> : <User size={32} />}
                  <label>
                    <Camera size={13} />
                    <input type="file" accept="image/*" onChange={uploadImage} />
                  </label>
                </div>
                <div>
                  <h3>{userName} <span>✓ Terverifikasi</span></h3>
                  <p>Format JPG, PNG, atau WebP. Maksimal 2MB. Foto digunakan untuk personalisasi ringkasan laporan dan audit log transaksi.</p>
                  <button type="button" className="small-button" onClick={() => document.querySelector('.profile-image input')?.click()}>
                    <Camera size={13} /> Ubah Foto Profil
                  </button>
                </div>
              </div>

              <div className="settings-form-grid">
                <Field
                  label="NAMA LENGKAP"
                  value={profile.name}
                  onChange={(value) => setProfile({ ...profile, name: value })}
                  icon={<User size={13} />}
                />
                <Field
                  label="EMAIL UTAMA"
                  value={profile.email}
                  onChange={(value) => setProfile({ ...profile, email: value })}
                  type="email"
                  icon={<Mail size={13} />}
                />
                <Field
                  label="NOMOR TELEPON / WHATSAPP"
                  value={profile.phone}
                  onChange={(value) => setProfile({ ...profile, phone: value })}
                  icon={<Phone size={13} />}
                />
                <Field
                  label="PEKERJAAN / STATUS AKADEMIK"
                  value={profile.bio}
                  onChange={(value) => setProfile({ ...profile, bio: value })}
                  icon={<BriefcaseIcon />}
                />
                <label className="setting-field">
                  <span>MATA UANG UTAMA</span>
                  <select value={preferences.currency} onChange={(event) => setPreferences({ ...preferences, currency: event.target.value })}>
                    <option value="IDR">IDR - Rupiah Indonesia (Rp)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                  </select>
                </label>
                <label className="setting-field">
                  <span>FORMAT TANGGAL</span>
                  <select 
                    value={preferences.dateFormat} 
                    onChange={(event) => setPreferences({ ...preferences, dateFormat: event.target.value })}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Contoh: 28/05/2025)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (Contoh: 05/28/2025)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (Contoh: 2025-05-28)</option>
                  </select>
                </label>
              </div>

              <button className="save-profile-button" disabled={loading}>
                <Save size={15} /> {loading ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </form>
          </section>

          {/* Security Settings */}
          <section className="settings-card security-settings">
            <CardHeading
              icon={<Lock size={18} />}
              title="Keamanan, Sandi & Autentikasi"
              subtitle="Proteksi kriptografi dan kendali akses sesi multi-device terenkripsi"
              badge="SKPL FR-02 & FR-03"
            />
            <form onSubmit={updatePassword}>
              <div className="password-box">
                <h3>Pembaruan Kata Sandi Akun</h3>
                <div className="password-grid">
                  <PasswordField
                    label="Kata Sandi Saat Ini"
                    value={password.currentPassword}
                    onChange={(value) => setPassword({ ...password, currentPassword: value })}
                  />
                  <PasswordField
                    label="Kata Sandi Baru"
                    value={password.newPassword}
                    onChange={(value) => setPassword({ ...password, newPassword: value })}
                  />
                  <PasswordField
                    label="Konfirmasi Kata Sandi Baru"
                    value={password.confirmPassword}
                    onChange={(value) => setPassword({ ...password, confirmPassword: value })}
                  />
                </div>
                <div className="password-strength">
                  <span>━━ ━━ ━━ ━━</span>
                  <b>Sangat Kuat (Argon2id Enkripsi 64MB Memory Cost)</b>
                  <button disabled={loading}>Perbarui Sandi</button>
                </div>
              </div>
            </form>
          </section>
        </main>

        <aside className="settings-aside">
          {/* Notification Preferences */}
          <NotificationCard notifications={notifications} toggle={togglePreference} />

          {/* Danger Zone */}
          <section className="danger-card">
            <h3>⚠ ZONA BERBAHAYA</h3>
            <p>Tindakan di bawah ini berdampak permanen pada sesi otentikasi dan integritas seluruh relasi akun Anda.</p>
            <button onClick={() => setDeleteOpen(true)}>⇥ Keluar dari Sesi Econary</button>
            <small>Hapus Akun &amp; Arsipkan Data Finansial</small>
          </section>
        </aside>
      </div>

      {/* Delete Account Modal */}
      {deleteOpen && (
        <div className="settings-modal">
          <div>
            <button className="modal-close" onClick={() => setDeleteOpen(false)}>
              <X size={17} />
            </button>
            <div className="danger-symbol">⚠</div>
            <h2>Hapus Akun Econary?</h2>
            <p>Tindakan ini tidak dapat dibatalkan. Seluruh data akan dihapus permanen.</p>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
            />
            <button className="delete-confirm" disabled={loading} onClick={deleteAccount}>
              {loading ? 'Menghapus...' : 'Ya, Hapus Akun'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function CardHeading({ icon, title, subtitle, badge }) {
  return (
    <div className="settings-card-heading">
      <div className="settings-card-icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {badge && <span>{badge}</span>}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', icon }) {
  return (
    <label className="setting-field">
      <span>{label}</span>
      <div>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={label.includes('NAMA') || label.includes('EMAIL')}
        />
        <i>{icon}</i>
      </div>
    </label>
  );
}

function BriefcaseIcon() {
  return <span style={{ fontSize: 13 }}>▣</span>;
}

function Toggle({ active, onChange }) {
  return (
    <button className={`settings-toggle ${active ? 'on' : ''}`} onClick={() => onChange(!active)}>
      <i />
    </button>
  );
}

function NotificationCard({ notifications, toggle }) {
  return (
    <section className="aside-card">
      <CardHeading
        icon={<Bell size={16} />}
        title="Preferensi Notifikasi"
        subtitle="Aturan pengingat & laporan analitik berkala"
      />
      {[
        ['budget', 'Peringatan Anggaran Kritis', 'Early warning otomatis ketika pagu bulanan terserap >80%'],
        ['transaction', 'Pengingat Mutasi Transaksi', 'Prompt review transaksi harian via push notif jam 20.00 WIB'],
        ['email', 'Laporan Mingguan via Email', 'Ringkasan infografis cash flow dikirim tiap Senin pukul 07.00 WIB'],
        ['universe', 'Insight Alternate Universe', 'Notifikasi simulasi jika pengeluaran impulsif berhasil dihindari']
      ].map(([key, title, desc]) => (
        <div className="notification-row" key={key}>
          <div>
            <b>{title}</b>
            <small>{desc}</small>
          </div>
          <Toggle active={notifications[key]} onChange={(value) => toggle(key, value)} />
        </div>
      ))}
    </section>
  );
}

function PasswordField({ label, value, onChange }) {
  return (
    <label className="password-field">
      <span>{label}</span>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="••••••••••"
        required
      />
    </label>
  );
}
