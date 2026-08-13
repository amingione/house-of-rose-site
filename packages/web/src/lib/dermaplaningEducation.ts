/**
 * Definition cross-checked against Cleveland Clinic's reviewed Dermaplaning
 * overview; the hair-regrowth answer is cross-checked against Mayo Clinic's
 * reviewed shaving guidance. Appointment and facial-waxing area facts come
 * from the 2026-08-06 GG reconciliation.
 * https://my.clevelandclinic.org/health/treatments/22680-dermaplaning
 * https://www.mayoclinic.org/healthy-lifestyle/adult-health/expert-answers/hair-removal/faq-20058427
 */
export const DERMAPLANING_EDUCATION = {
  title: 'Dermaplaning',
  whatItIs:
    'Dermaplaning is a surface-exfoliation service that removes fine vellus hair and accumulated dead skin cells from the face with a specialized blade.',
  whereItFits:
    'It is the relevant House of Rose service when peach fuzz and surface buildup are the concern. Amber Mingione, Licensed Esthetician, provides dermaplaning as a standalone facial and as a shorter add-on.',
  menu: [
    {
      name: 'Dermaplaning — Facial (standalone)',
      priceUsd: 135,
      durationMinutes: 50,
    },
    {
      name: 'Dermaplaning — Add-On',
      priceUsd: 45,
      durationMinutes: 25,
    },
  ],
  faqs: [
    {
      question: 'Will peach fuzz grow back thicker or darker after dermaplaning?',
      answer:
        'No. Dermaplaning cuts hair at the skin surface; it does not change the hair’s thickness, color, or rate of growth. Early regrowth can feel blunt or stubbly because the tapered tip was cut, but the follicle has not changed.',
    },
    {
      question: 'How is dermaplaning different from facial waxing?',
      answer:
        'Dermaplaning uses a specialized blade across the facial surface to remove fine vellus hair and accumulated dead skin cells. Facial waxing uses wax and is booked by area at House of Rose for the brows, upper lip, and chin.',
    },
  ],
} as const;
