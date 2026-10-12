import { useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, Check, LoaderCircle, RotateCcw } from 'lucide-react';
import { DURATION, EASE_OUT } from '../lib/motion';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal';

const features = [
  {
    title: 'Ask in plain language',
    description:
      'Describe the shoot the way you would to a line producer. NKO handles the structure.',
  },
  {
    title: 'Grounded in real rates',
    description:
      'Drafts use local crew and equipment rates and your past productions, with the reasoning shown.',
  },
  {
    title: 'Every line stays editable',
    description:
      'AI drafts are a starting point. Change any figure and the totals rebalance instantly.',
  },
];


const budgetTotal = 25_000_000;
const budgetLines = [
  { name: 'Above the line', detail: 'Director, producer, 1st AD', share: 15 },
  { name: 'Production crew', detail: '24 crew × 10 days + 3 prep', share: 22 },
  { name: 'Talent & casting', detail: '2 leads, 6 featured, extras', share: 11 },
  { name: 'Camera & lighting', detail: 'ARRI package, grip, crane day', share: 17 },
  { name: 'Locations & permits', detail: '4 locations, LASO permits', share: 10 },
  { name: 'Art & wardrobe', detail: 'Set dressing, 3 looks per lead', share: 7 },
  { name: 'Post-production', detail: 'Edit, grade, sound, VFX cleanup', share: 9 },
  { name: 'Logistics & catering', detail: 'Transport, meals for 40', share: 4 },
  { name: 'Contingency', detail: '5% reserve', share: 5 },
].map((line) => ({ ...line, amount: (budgetTotal * line.share) / 100 }));

const preliminaryBudget = {
  currency: 'NGN',
  productionType: 'Commercial',
  shootDays: 10,
  total: budgetTotal,
  lines: budgetLines,
};

const numberFormat = new Intl.NumberFormat('en-NG', {
  maximumFractionDigits: 0,
});
const formatNaira = (amount) => `₦${numberFormat.format(amount)}`;
const maxShare = Math.max(...budgetLines.map((line) => line.share));

function ActionButton({ children, onClick, primary = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
      className={`inline-flex min-h-11 items-center justify-center rounded-md border px-3 py-2 text-[11px] leading-snug font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-palette-apricot disabled:cursor-default sm:min-h-8 ${
        primary
          ? 'border-palette-apricot bg-palette-apricot text-palette-black enabled:hover:bg-palette-apricot/90'
          : 'border-palette-graphite bg-palette-near-black text-palette-stone enabled:hover:border-palette-stone enabled:hover:text-palette-ivory'
      }`}
    >
      {children}
    </motion.button>
  );
}


export default function ProductionIntelligenceSection({
  className = '',
  onReplay,
  onOpenBudgetEditor,
  onAdjustAssumptions,
  onAddCutdowns,
  onSendMessage,
}) {
  const headingId = useId();
  const panelId = useId();
  const messageId = useId();
  const errorId = useId();
  const reduceMotion = useReducedMotion();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const sendingRef = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const value = message.trim();
    if (!value || !onSendMessage || sendingRef.current) return;

    sendingRef.current = true;
    setIsSending(true);
    setSendError('');
    try {
      await onSendMessage(value);
      setMessage('');
    } catch {
      setSendError('Couldn’t send your message. Please try again.');
    } finally {
      sendingRef.current = false;
      setIsSending(false);
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className={`isolate overflow-hidden bg-palette-black px-5 text-palette-ivory sm:px-8 lg:px-12 ${className}`}
    >
      <div className="mx-auto max-w-[1320px] border-b border-palette-charcoal/60 py-16 sm:py-24 lg:py-36">
        <div className="mx-auto grid max-w-[1200px] items-start gap-12 lg:grid-cols-[0.73fr_1fr] lg:gap-9">
          <div className="min-w-0 lg:pt-6">
            <Reveal
              as="h2"
              id={headingId}
              className="text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[1.02] font-normal tracking-[-0.045em]"
            >
              <span className="block">Meet the{' '}</span>
              <span className="block">intelligence{' '}</span>
              <span className="block">behind your{' '}</span>
              <span className="block">production.</span>
            </Reveal>
            <Reveal
              as="p"
              delay={0.08}
              className="mt-8 max-w-[29rem] text-sm leading-relaxed text-palette-stone sm:text-base lg:mt-10"
            >
              The NKO assistant understands production departments, shoot days,
              rates and reserves. Ask for a budget and get a structured draft you
              can actually work from.
            </Reveal>
            <Stagger as="dl" stagger={0.06} className="mt-8 max-w-[30rem] sm:mt-10">
              {features.map(({ title, description }) => (
                <StaggerItem
                  key={title}
                  className="border-t border-palette-charcoal py-5"
                >
                  <dt className="text-sm leading-snug font-medium">{title}</dt>
                  <dd className="mt-2 text-[13px] leading-relaxed text-palette-stone">
                    {description}
                  </dd>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal
            className="relative isolate min-w-0"
            delay={0.12}
            distance={24}
            duration={DURATION.slow}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[40%] bg-palette-apricot/10 blur-3xl"
            />
            <div
              role="region"
              aria-labelledby={panelId}
              className="overflow-hidden rounded-xl border border-palette-gold/20 bg-palette-near-black shadow-2xl shadow-palette-black/40"
            >
              <div className="flex min-h-14 flex-wrap items-center gap-x-2 gap-y-1 border-b border-palette-charcoal px-4 py-2 sm:px-6">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-palette-apricot"
                />
                <h3 id={panelId} className="text-xs font-medium">
                  NKO Assistant
                </h3>
                <span className="font-mono text-[10px] text-palette-stone">
                  · New production
                </span>
                <motion.button
                  type="button"
                  onClick={onReplay}
                  disabled={!onReplay}
                  aria-label="Replay the budget example"
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-sm px-1 font-mono text-[10px] text-palette-stone enabled:hover:text-palette-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-apricot disabled:cursor-default sm:min-h-8"
                >
                  <RotateCcw aria-hidden="true" size={12} strokeWidth={1.5} />
                  Replay
                </motion.button>
              </div>

              <div className="space-y-5 p-3 sm:p-6">
                <p className="rounded-md bg-palette-charcoal/60 p-3 text-xs leading-relaxed sm:p-4 sm:text-[13px]">
                  Create a preliminary budget for a 10-day commercial shoot with
                  a ₦25M production budget.
                </p>

                <Stagger
                  as="ul"
                  stagger={0.1}
                  className="space-y-2 font-mono text-[10px] leading-relaxed text-palette-stone sm:text-[11px]"
                >
                  {[
                    'Reading parameters: Commercial · 10 shoot days · ₦25,000,000',
                    'Applying Lagos day rates for crew, camera and grip',
                    'Reserving 5% contingency and allocating post',
                  ].map((step) => (
                    <StaggerItem
                      as="li"
                      key={step}
                      className="flex items-start gap-2.5"
                    >
                      <Check
                        aria-hidden="true"
                        size={14}
                        strokeWidth={2}
                        className="mt-0.5 shrink-0 text-palette-apricot"
                      />
                      <span>{step}</span>
                    </StaggerItem>
                  ))}
                </Stagger>

                <div className="overflow-hidden rounded-lg border border-palette-graphite bg-palette-black">
                  <div className="flex items-center justify-between gap-3 border-b border-palette-charcoal px-3 py-3 sm:px-4">
                    <div>
                      <p className="text-xs font-medium sm:text-[13px]">
                        Preliminary budget
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-palette-stone">
                        Commercial · 10 days · Draft v1
                      </p>
                    </div>
                    <span className="rounded-sm border border-palette-graphite px-2 py-0.5 font-mono text-[10px] text-palette-stone">
                      Draft
                    </span>
                  </div>

                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only">
                      Preliminary commercial production budget in Nigerian naira.
                    </caption>
                    <thead className="sr-only">
                      <tr>
                        <th scope="col">Department and assumptions</th>
                        <th scope="col">Allocation</th>
                        <th scope="col">Amount in naira</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-palette-charcoal">
                      {budgetLines.map(({ name, detail, share, amount }) => (
                        <tr key={name}>
                          <th
                            scope="row"
                            className="px-2 py-3 align-middle font-normal sm:px-4"
                          >
                            <span className="block text-[11px] leading-snug sm:text-[13px]">
                              {name}
                            </span>
                            <span className="mt-0.5 block text-[10px] leading-snug text-palette-stone sm:text-[11px]">
                              {detail}
                            </span>
                          </th>
                          <td className="px-1 py-3 align-middle sm:px-2">
                            <div className="flex items-center justify-end gap-3">
                              <span
                                aria-hidden="true"
                                className="hidden h-0.5 w-14 shrink-0 bg-palette-graphite sm:block"
                              >
                                <span
                                  className="block h-full bg-palette-gray"
                                  style={{ width: `${(share / maxShare) * 100}%` }}
                                />
                              </span>
                              <span className="w-6 text-right font-mono text-[10px] text-palette-stone">
                                {share}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-2 text-right align-middle font-mono text-[10px] whitespace-nowrap sm:pr-4 sm:text-xs">
                            {formatNaira(amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-palette-charcoal">
                      <tr>
                        <th
                          scope="row"
                          colSpan={2}
                          className="px-2 py-3 text-[10px] font-normal text-palette-stone sm:px-4 sm:text-[11px]"
                        >
                          Total · 100% allocated
                        </th>
                        <td className="py-3 pr-2 text-right font-mono text-[10px] whitespace-nowrap text-palette-apricot sm:pr-4 sm:text-xs">
                          {formatNaira(budgetTotal)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div>
                  <p className="text-[11px] leading-relaxed text-palette-stone sm:text-xs">
                    Crew and camera account for 39%, typical for a commercial at
                    this scale. I held post at 9% assuming one 60s spot and two
                    cutdowns. Want me to adjust?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionButton
                      primary
                      onClick={
                        onOpenBudgetEditor
                          ? () => onOpenBudgetEditor(preliminaryBudget)
                          : undefined
                      }
                    >
                      Open in budget editor
                    </ActionButton>
                    <ActionButton
                      onClick={
                        onAdjustAssumptions
                          ? () => onAdjustAssumptions(preliminaryBudget)
                          : undefined
                      }
                    >
                      Adjust assumptions
                    </ActionButton>
                    <ActionButton
                      onClick={
                        onAddCutdowns
                          ? () => onAddCutdowns(preliminaryBudget)
                          : undefined
                      }
                    >
                      Add cutdowns
                    </ActionButton>
                  </div>
                </div>

                <form onSubmit={handleSubmit} aria-busy={isSending}>
                  <label htmlFor={messageId} className="sr-only">
                    Ask NKO to change the production budget
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-palette-graphite bg-palette-black p-1 focus-within:border-palette-apricot">
                    <input
                      id={messageId}
                      name="message"
                      type="text"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      disabled={!onSendMessage || isSending}
                      aria-invalid={Boolean(sendError)}
                      aria-describedby={sendError ? errorId : undefined}
                      placeholder="Ask NKO to change anything…"
                      className="min-h-11 min-w-0 flex-1 bg-transparent px-2 text-xs text-palette-ivory outline-none placeholder:text-palette-stone sm:min-h-9"
                    />
                    <motion.button
                      type="submit"
                      disabled={!onSendMessage || !message.trim() || isSending}
                      aria-label={isSending ? 'Sending message' : 'Send message'}
                      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                      className="flex size-11 shrink-0 items-center justify-center rounded-md bg-palette-charcoal text-palette-stone enabled:hover:bg-palette-apricot enabled:hover:text-palette-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-apricot disabled:cursor-default sm:size-7"
                    >
                      {isSending ? (
                        <LoaderCircle
                          aria-hidden="true"
                          size={15}
                          className="motion-safe:animate-spin"
                        />
                      ) : (
                        <ArrowUp aria-hidden="true" size={15} strokeWidth={2} />
                      )}
                    </motion.button>
                  </div>
                  <p className="sr-only" role="status">
                    {isSending ? 'Sending message…' : ''}
                  </p>
                  {sendError && (
                    <p
                      id={errorId}
                      role="alert"
                      className="mt-2 text-xs leading-relaxed text-palette-apricot"
                    >
                      {sendError}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
