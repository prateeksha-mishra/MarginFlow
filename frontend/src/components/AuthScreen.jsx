import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('signin')
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageIsError, setMessageIsError] = useState(false)

  const isSignUp = mode === 'signup'

  function updateValue(event) {
    const { name, value, checked, type } = event.currentTarget
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setMessage('')
  }

  function handleForgotPassword() {
    setMessage('Password reset is not connected in this local preview.')
    setMessageIsError(false)
  }

  function handleAuthSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (isSignUp && values.password !== values.confirmPassword) {
      setMessage('Those passwords do not match. Please check and try again.')
      setMessageIsError(true)
      return
    }

    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      onLoginSuccess?.()
    }, 450)
  }

  return (
    <main className="min-h-svh bg-[#080a12] text-slate-100 lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-svh flex-col justify-between overflow-hidden border-r border-white/[0.06] bg-[radial-gradient(ellipse_at_15%_12%,rgba(99,102,241,0.2),transparent_44%),linear-gradient(145deg,#0b0d19_0%,#101326_52%,#090b14_100%)] px-10 py-10 lg:flex xl:px-16 xl:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
        />

        <BrandMark />

        <div className="relative z-10 mx-auto w-full max-w-xl py-12">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
            <span className="size-1.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)] motion-safe:animate-pulse" />
            Financial clarity, in real time
          </p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight text-white xl:text-6xl">
            Make every
            <br />
            number move
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">
              you forward.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
            A sharper view of cash flow, unusual activity, and the decisions
            behind a stronger business.
          </p>

          <div className="mt-14 max-w-lg border-y border-white/[0.08] py-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Cash flow snapshot
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  A clearer view
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-xs font-medium text-emerald-300">
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
                Cash flow
              </span>
            </div>
            <div
              aria-hidden="true"
              className="mt-5 flex h-28 items-end gap-2 border-b border-l border-white/[0.1] px-3"
            >
              {[34, 49, 42, 65, 55, 76, 68, 92, 78, 100, 86, 112].map(
                (height, index) => (
                  <span
                    key={index}
                    className={`min-w-2 flex-1 rounded-t-sm bg-gradient-to-t from-indigo-600/30 to-indigo-300/80 transition-opacity duration-500 ${index === 9 ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                    style={{ height: `${height}px` }}
                  />
                ),
              )}
            </div>
            <div className="mt-3 flex justify-between text-[11px] text-slate-500">
              <span>Cash in</span>
              <span>Cash out</span>
              <span>Patterns</span>
              <span>Insights</span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <ValuePoint
              title="See the whole picture"
              text="Bring transactions into one readable view."
            />
            <ValuePoint
              title="Spot what stands out"
              text="Surface activity that deserves a closer look."
            />
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          MarginFlow · A calmer way to understand your numbers
        </p>
      </section>

      <section className="flex min-h-svh items-center justify-center px-5 py-9 sm:px-10 lg:px-12 xl:px-16">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 lg:hidden">
            <BrandMark />
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium text-indigo-300">
              {isSignUp ? 'Start with a clear view' : 'Welcome back'}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {isSignUp ? 'Create your account' : 'Sign in to MarginFlow'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {isSignUp
                ? 'Set up your workspace to get started.'
                : 'Your business finances, right where you left them.'}
            </p>
          </div>

          <div
            aria-label="Authentication options"
            className="grid grid-cols-2 rounded-lg border border-white/[0.08] bg-slate-900/70 p-1"
            role="tablist"
          >
            <button
              aria-selected={!isSignUp}
              className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${!isSignUp ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => changeMode('signin')}
              role="tab"
              type="button"
            >
              Sign In
            </button>
            <button
              aria-selected={isSignUp}
              className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${isSignUp ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => changeMode('signup')}
              role="tab"
              type="button"
            >
              Sign Up
            </button>
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleAuthSubmit}>
            {isSignUp ? (
              <FormField
                autoComplete="name"
                icon={UserRound}
                label="Full name"
                name="fullName"
                onChange={updateValue}
                placeholder="Jordan Lee"
                required
                value={values.fullName}
              />
            ) : null}

            <FormField
              autoComplete="email"
              icon={Mail}
              label="Email address"
              name="email"
              onChange={updateValue}
              placeholder="you@company.com"
              required
              type="email"
              value={values.email}
            />

            <FormField
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              icon={LockKeyhole}
              label="Password"
              name="password"
              onChange={updateValue}
              placeholder="At least 8 characters"
              required
              minLength={8}
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              trailing={
                <VisibilityButton
                  isVisible={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                />
              }
            />

            {isSignUp ? (
              <FormField
                autoComplete="new-password"
                icon={LockKeyhole}
                label="Confirm password"
                name="confirmPassword"
                onChange={updateValue}
                placeholder="Enter your password again"
                required
                minLength={8}
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                trailing={
                  <VisibilityButton
                    isVisible={showConfirmPassword}
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                  />
                }
              />
            ) : null}

            {!isSignUp ? (
              <div className="flex items-center justify-between gap-4 pt-0.5">
                <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-400">
                  <input
                    checked={values.remember}
                    className="size-4 rounded border-slate-700 bg-slate-900 accent-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a12]"
                    name="remember"
                    onChange={updateValue}
                    type="checkbox"
                  />
                  Remember me
                </label>
                <button
                  className="text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  onClick={handleForgotPassword}
                  type="button"
                >
                  Forgot password?
                </button>
              </div>
            ) : null}

            {message ? (
              <p
                className={`rounded-md border px-3.5 py-3 text-sm ${messageIsError ? 'border-rose-400/20 bg-rose-400/[0.07] text-rose-300' : 'border-indigo-300/15 bg-indigo-300/[0.06] text-indigo-200'}`}
                role={messageIsError ? 'alert' : 'status'}
              >
                {message}
              </p>
            ) : null}

            <button
              className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(79,70,229,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-[0_10px_32px_rgba(79,70,229,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a12] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Opening your workspace…' : isSignUp ? 'Create account' : 'Sign in'}
              {!isSubmitting ? (
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              ) : null}
            </button>
          </form>

          <div className="mt-7 flex items-start gap-2.5 border-t border-white/[0.07] pt-5 text-xs leading-5 text-slate-500">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400" />
            <p>
              Local preview only. Authentication is mocked; no password is sent
              to a server or stored.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function BrandMark() {
  return (
    <div className="relative z-10 flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-lg border border-indigo-300/20 bg-indigo-400/10 text-indigo-200 shadow-[0_0_28px_rgba(99,102,241,0.14)]">
        <ChartNoAxesCombined aria-hidden="true" className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-white">
        Margin<span className="text-indigo-300">Flow</span>
      </span>
    </div>
  )
}

function ValuePoint({ title, text }) {
  return (
    <div className="border-l border-indigo-300/30 pl-3.5">
      <p className="text-sm font-medium text-slate-200">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  )
}

function FormField({
  autoComplete,
  icon: Icon,
  label,
  minLength,
  name,
  onChange,
  placeholder,
  required,
  trailing,
  type = 'text',
  value,
}) {
  const id = `auth-${name}`

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor={id}>
        {label}
      </label>
      <div className="group relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-300"
        />
        <input
          autoComplete={autoComplete}
          className="h-12 w-full rounded-md border border-slate-700/80 bg-slate-900/80 pl-10 pr-12 text-sm text-white outline-none transition duration-150 placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-400 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-400/10"
          id={id}
          minLength={minLength}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
        {trailing ? (
          <span className="absolute inset-y-0 right-2 flex items-center">
            {trailing}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function VisibilityButton({ isVisible, onClick }) {
  const Icon = isVisible ? EyeOff : Eye

  return (
    <button
      aria-label={isVisible ? 'Hide password' : 'Show password'}
      className="rounded p-1.5 text-slate-500 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  )
}

export default AuthScreen