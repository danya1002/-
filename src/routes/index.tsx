import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  Wifi,
  Settings,
  Folder,
  Monitor,
  Store,
  Globe,
  PanelLeft,
  Power,
  Bell,
  Volume2,
  Battery,
  User,
  X,
  Minus,
  Maximize2,
} from 'lucide-react'

type OobeStep =
  | 'region'
  | 'language'
  | 'keyboard'
  | 'network'
  | 'account'
  | 'privacy'
  | 'personalization'
  | 'finalizing'

type AppId =
  | 'settings'
  | 'control-panel'
  | 'explorer'
  | 'task-manager'
  | 'store'
  | 'browser'
  | 'office'

const wallpapers = [
  'radial-gradient(circle at top, #6a9afc 0%, #2f4e9c 45%, #13203d 100%)',
  'radial-gradient(circle at top right, #4db2ff 0%, #1f5ec9 40%, #111a3d 100%)',
  'linear-gradient(135deg, #0f2c8f 0%, #255fd9 55%, #5cc2ff 100%)',
]

const oobeSteps: OobeStep[] = [
  'region',
  'language',
  'keyboard',
  'network',
  'account',
  'privacy',
  'personalization',
  'finalizing',
]

function Home() {
  const [phase, setPhase] = useState<'boot' | 'oobe' | 'desktop'>('boot')
  const [bootProgress, setBootProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [wallpaperIndex, setWallpaperIndex] = useState(0)
  const [startOpen, setStartOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [openApps, setOpenApps] = useState<AppId[]>(['explorer'])
  const [activeApp, setActiveApp] = useState<AppId>('explorer')

  const step = oobeSteps[stepIndex]

  useEffect(() => {
    if (phase !== 'boot') return

    const timer = setInterval(() => {
      setBootProgress((prev) => {
        const next = Math.min(prev + 8, 100)
        if (next === 100) {
          clearInterval(timer)
          setTimeout(() => setPhase('oobe'), 800)
        }
        return next
      })
    }, 260)

    return () => clearInterval(timer)
  }, [phase])

  const stepTitle = useMemo(() => {
    switch (step) {
      case 'region':
        return 'Выбор региона'
      case 'language':
        return 'Язык интерфейса'
      case 'keyboard':
        return 'Раскладка клавиатуры'
      case 'network':
        return 'Подключение к сети'
      case 'account':
        return 'Создание учётной записи'
      case 'privacy':
        return 'Параметры конфиденциальности'
      case 'personalization':
        return 'Персонализация'
      case 'finalizing':
        return 'Подготовка Windows'
      default:
        return ''
    }
  }, [step])

  const nextStep = () => {
    if (stepIndex >= oobeSteps.length - 1) {
      setPhase('desktop')
      return
    }
    setStepIndex((prev) => prev + 1)
  }

  const launchApp = (app: AppId) => {
    setOpenApps((prev) => (prev.includes(app) ? prev : [...prev, app]))
    setActiveApp(app)
    setStartOpen(false)
  }

  const closeApp = (app: AppId) => {
    setOpenApps((prev) => prev.filter((item) => item !== app))
    if (activeApp === app) {
      const fallback = openApps.filter((item) => item !== app).at(-1)
      if (fallback) setActiveApp(fallback)
    }
  }

  if (phase === 'boot') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0f14] text-white">
        <div className="w-full max-w-xl px-8 text-center">
          <div className="mb-8 text-5xl font-light tracking-widest">⊞</div>
          <h1 className="mb-2 text-2xl font-semibold">Windows 11</h1>
          <p className="mb-8 text-sm text-blue-100/70">Запуск системы...</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#4da3ff] transition-all duration-300"
              style={{ width: `${bootProgress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'oobe') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0f1f51] to-[#060d1f] p-6 text-white">
        <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-blue-100/70">Первоначальная настройка</p>
          <h2 className="mb-6 text-3xl font-semibold">{stepTitle}</h2>

          <div className="mb-8 min-h-36 rounded-2xl bg-black/20 p-5 text-sm text-blue-50/90">
            {step === 'region' && 'Регион: Россия. От этого зависят формат времени и валюта.'}
            {step === 'language' && 'Язык системы: Русский (Россия), установлен пакет озвучивания и распознавания.'}
            {step === 'keyboard' && 'Основная раскладка: Русская. Дополнительная: US — EN.'}
            {step === 'network' && 'Подключение к Wi‑Fi: Home_5G. Проверка безопасности и доступности обновлений.'}
            {step === 'account' && 'Выберите Microsoft-аккаунт или локальную учётную запись администратора.'}
            {step === 'privacy' && 'Диагностика, история действий, местоположение, рукописный ввод и рекламный ID.'}
            {step === 'personalization' && 'Тема: светлая. Обои: Bloom. Центрированный Пуск и акцентный цвет включены.'}
            {step === 'finalizing' && 'Применяем параметры... Это займёт несколько минут. Не выключайте устройство.'}
          </div>

          <div className="mb-8 flex gap-2">
            {oobeSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full ${idx <= stepIndex ? 'bg-blue-300' : 'bg-white/15'}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              className="rounded-xl border border-white/30 px-4 py-2 text-sm text-blue-100 transition hover:bg-white/10"
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
            >
              Назад
            </button>
            <button className="rounded-xl bg-[#3f8dff] px-5 py-2 text-sm font-medium hover:bg-[#4f98ff]" onClick={nextStep}>
              {stepIndex === oobeSteps.length - 1 ? 'Войти в систему' : 'Далее'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-white" style={{ background: wallpapers[wallpaperIndex] }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_55%)]" />
      <div className="relative flex min-h-screen flex-col justify-between p-6">
        <div className="grid grid-cols-6 gap-4 max-w-xs">
          {[
            { id: 'explorer' as AppId, label: 'Проводник', icon: Folder },
            { id: 'settings' as AppId, label: 'Параметры', icon: Settings },
            { id: 'control-panel' as AppId, label: 'Панель управления', icon: PanelLeft },
            { id: 'store' as AppId, label: 'Microsoft Store', icon: Store },
            { id: 'browser' as AppId, label: 'Браузер', icon: Globe },
            { id: 'task-manager' as AppId, label: 'Диспетчер задач', icon: Monitor },
          ].map((shortcut) => (
            <button
              key={shortcut.id}
              className="group flex flex-col items-center gap-2 rounded-xl p-2 hover:bg-white/15"
              onDoubleClick={() => launchApp(shortcut.id)}
            >
              <shortcut.icon size={28} className="rounded-md bg-white/15 p-1.5" />
              <span className="text-xs text-center leading-tight">{shortcut.label}</span>
            </button>
          ))}
        </div>

        {openApps.map((app, idx) => (
          <div
            key={app}
            className="absolute left-1/2 top-[16%] w-[64rem] max-w-[95vw] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/25 bg-white/20 shadow-2xl backdrop-blur-2xl"
            style={{ transform: `translateX(-50%) translateY(${idx * 18}px)`, zIndex: app === activeApp ? 50 : 30 + idx }}
            onMouseDown={() => setActiveApp(app)}
          >
            <div className="flex items-center justify-between border-b border-white/20 bg-black/25 px-4 py-2 text-sm">
              <span>{app === 'control-panel' ? 'Панель управления' : app === 'task-manager' ? 'Диспетчер задач' : app === 'office' ? 'Office' : app === 'browser' ? 'Microsoft Edge' : app === 'store' ? 'Microsoft Store' : app === 'explorer' ? 'Проводник' : 'Параметры'}</span>
              <div className="flex items-center gap-2">
                <Minus size={14} className="opacity-70" />
                <Maximize2 size={14} className="opacity-70" />
                <button onClick={() => closeApp(app)}>
                  <X size={14} className="hover:text-red-300" />
                </button>
              </div>
            </div>
            <div className="h-72 bg-white/90 p-4 text-sm text-slate-800">
              {app === 'explorer' && 'Этот компьютер • Документы • Загрузки • Рабочий стол. Поддерживается копирование, удаление и создание файлов.'}
              {app === 'settings' && 'Разделы: Система, Bluetooth и устройства, Сеть и интернет, Персонализация, Обновление Windows.'}
              {app === 'control-panel' && 'Категории: Программы, Учётные записи, Оборудование и звук, Электропитание, Центр безопасности.'}
              {app === 'task-manager' && 'Процессы: Explorer.exe, DWM.exe, ShellExperienceHost, Defender. Отображается использование CPU, RAM и сети.'}
              {app === 'store' && 'Microsoft Store: установка и удаление приложений, обновления, библиотека и оценки.'}
              {app === 'browser' && 'Edge открыт на странице Windows 11 tips. Вкладки, история, загрузки, расширения — доступны.'}
              {app === 'office' && 'Office 365: Word, Excel, PowerPoint. Документы сохраняются локально и в OneDrive.'}
            </div>
          </div>
        ))}

        <div className="relative mx-auto w-full max-w-4xl rounded-2xl border border-white/20 bg-black/35 px-4 py-2 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="rounded-lg bg-white/15 px-3 py-1" onClick={() => setStartOpen((p) => !p)}>
                ⊞ Пуск
              </button>
              {(['explorer', 'browser', 'settings', 'store'] as AppId[]).map((id) => (
                <button
                  key={id}
                  className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                  onClick={() => launchApp(id)}
                >
                  {id}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-50/90">
              <Wifi size={16} />
              <Volume2 size={16} />
              <Battery size={16} />
              <button onClick={() => setNotificationsOpen((p) => !p)}>
                <Bell size={16} />
              </button>
              <span>12:41</span>
            </div>
          </div>

          {startOpen && (
            <div className="absolute bottom-16 left-8 w-96 rounded-2xl border border-white/25 bg-slate-950/80 p-4 backdrop-blur-2xl">
              <p className="mb-3 text-sm text-blue-100">Закреплённые</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  ['Параметры', 'settings' as AppId],
                  ['Проводник', 'explorer' as AppId],
                  ['Microsoft Store', 'store' as AppId],
                  ['Edge', 'browser' as AppId],
                  ['Office', 'office' as AppId],
                  ['Выключение', 'settings' as AppId],
                ].map(([label, id]) => (
                  <button key={label} className="rounded-lg bg-white/10 px-2 py-3 hover:bg-white/20" onClick={() => launchApp(id)}>
                    {label}
                  </button>
                ))}
              </div>
              <button className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs hover:bg-white/20">
                <Power size={14} /> Завершение работы
              </button>
            </div>
          )}

          {notificationsOpen && (
            <div className="absolute bottom-16 right-4 w-80 rounded-2xl border border-white/25 bg-slate-950/80 p-4 text-xs backdrop-blur-2xl">
              <p className="mb-3 font-medium">Центр уведомлений</p>
              <div className="space-y-2">
                <div className="rounded-lg bg-white/10 p-2">Windows Update: доступны накопительные обновления KB5039211.</div>
                <div className="rounded-lg bg-white/10 p-2">OneDrive: синхронизация завершена.</div>
                <div className="rounded-lg bg-white/10 p-2">Защитник Windows: сканирование выполнено, угроз не найдено.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute right-6 top-6 rounded-xl border border-white/20 bg-black/35 p-3 text-xs backdrop-blur-xl">
        <p className="mb-2 flex items-center gap-2"><User size={14} /> Профиль: demo@outlook.com</p>
        <button
          className="rounded-md bg-white/15 px-2 py-1 hover:bg-white/25"
          onClick={() => setWallpaperIndex((prev) => (prev + 1) % wallpapers.length)}
        >
          Сменить обои
        </button>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
