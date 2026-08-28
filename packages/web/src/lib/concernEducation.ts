export interface ConcernEducation {
  heading: string;
  lead: string;
  metaDescription?: string;
  detail: string;
  distinction: string;
  consultationHeading: string;
  consultationPrompt: string;
}

const CONCERN_EDUCATION: Readonly<Record<string, ConcernEducation>> = {
  aging: {
    heading: 'Aging can show up in more than one way at once.',
    lead: 'A rougher surface, uneven color, a line that appears with expression, or reduced support in one area of the face can each be part of visible aging.',
    detail: 'It is common for more than one of these changes to appear at once. Surface treatments, pigment-focused services, neurotoxins, and volume-focused services have different roles, so “aging” does not have to be reduced to one treatment name.',
    distinction: 'Look once with your face at rest and once in expression. Notice what stands out most—surface, pigment, movement, or volume—and what you would prefer to leave alone.',
    consultationHeading: 'Start with what concerns you most.',
    consultationPrompt: 'A recent photograph that looks like you, not a perfectly posed one, is the most useful reference. Describe the roughness, uneven color, expression line, or reduced support you would like to address, and let us know if there is anything you do not want changed.',
  },
  'dark-circles': {
    heading: 'Under-eye darkness may be color, shadow, or both.',
    lead: 'What appears to be a dark circle may be pigment, thin or translucent skin showing visible vessels, a structural shadow, or a combination of these.',
    detail: 'A color change and a hollow can sit in the same place without calling for the same approach. Some under-eye concerns also sit outside what an aesthetic service can change.',
    distinction: 'The first useful distinction is what you can see: pigment, visible vessels, structural shadow, or more than one.',
    consultationHeading: 'What the darkness looks like to you.',
    consultationPrompt: 'During a consultation, we will look at whether it presents more as color, visible vessels, hollowing, or shadow.',
  },
  'fine-lines-laxity': {
    heading: 'The same area can show more than one kind of line.',
    lead: 'A line may come from repeated facial movement, skin texture, or a change in facial support. Laxity is another visible change, even when it appears nearby.',
    detail: 'House of Rose lists neurotoxins for movement-related lines, fillers for selected volume changes, and resurfacing or device services for surface texture and laxity. The location alone does not tell you which of those changes you are seeing.',
    distinction: 'Let your face rest, then make the expression that brings the line out. Notice whether it changes with movement, stays as a surface crease, or sits beside less volume or looser skin.',
    consultationHeading: 'The specific line or change matters most.',
    consultationPrompt: 'A relaxed photograph and one with expression can show more than a treatment name can. Bring both if they help, and say how much natural movement you want to keep.',
  },
  'acne-scarring': {
    heading: 'Look at the shape and depth of the scar.',
    lead: 'Atrophic acne scars are commonly described as ice-pick, rolling, or boxcar scars. More than one shape can appear in the same area.',
    detail: 'A narrow depression, a broader edge, and a rolling change in texture do not present the same way. Active breakouts add a separate question because they describe what is happening now, not only the texture left behind.',
    distinction: 'When you look from the front and from the side, notice whether the texture appears narrow, broad-edged, rolling, or mixed.',
    consultationHeading: 'Front and side views help identify the scar type.',
    consultationPrompt: 'Bring clear front and side photographs, plus a note about any breakouts that are still appearing. The two angles show the scar shape; the note separates active breakouts from established texture.',
  },
  'active-acne': {
    heading: 'Active breakouts and established scarring need different approaches.',
    lead: 'A new breakout is active now. Discoloration and established scars can remain after a breakout has settled, and both may be visible at the same time.',
    detail: 'The current Face Reality program is the House of Rose option for active breakouts. Scar-focused services address established texture, so seeing both concerns does not mean one appointment is expected to do both jobs.',
    distinction: 'Notice where new breakouts are forming and where the skin is calm but still shows color or texture.',
    consultationHeading: 'New breakouts and existing texture are evaluated separately.',
    consultationPrompt: 'Deep, painful, widespread, or actively scarring breakouts need medical evaluation before an esthetics program is considered. Otherwise, share where new breakouts are appearing and whether discoloration, indentations, or other established texture remain after they settle.',
  },
  hyperpigmentation: {
    heading: 'Uneven pigment can take several different forms.',
    lead: 'Uneven pigment can differ in depth, pattern, trigger, and response to light-based or exfoliating treatments.',
    detail: 'A brown spot, a broader area of uneven color, and discoloration after a breakout may look similar at first glance. Their pattern and history differ, even when all three are described as “pigmentation.”',
    distinction: 'Notice whether the color is isolated or spread out, and whether it followed a breakout, irritation, or time in the sun.',
    consultationHeading: 'The pattern of the discoloration guides the recommendation.',
    consultationPrompt: 'Describe whether you see a single spot, a diffuse patch, or discoloration left after inflammation, and when you first noticed it.',
  },
  'volume-loss': {
    heading: 'Reduced facial volume can look different depending on where it occurs.',
    lead: 'Less fullness or support can look like a hollow, fold, or shift in facial shape. A line that appears mainly with expression points to the neurotoxin menu instead.',
    metaDescription: 'Less facial fullness can look like a hollow, fold, or change in shape. Expression-related lines point to a different neurotoxin conversation.',
    detail: 'House of Rose dermal fillers use manufactured hyaluronic-acid gels. Injectable PRF is prepared from a small sample of your own blood. Botox and Daxxify address movement-related lines.',
    distinction: 'Look straight on and from the side. A hollow, fold, and expression line can appear close together; seeing the face from both angles makes the difference easier to point out.',
    consultationHeading: 'Where the change appears helps determine the right approach.',
    consultationPrompt: 'Bring a front and side photograph if the change is easier to see there. Point to whether it looks like a hollow, a fold, or a line that changes with expression.',
  },
  'sun-damage': {
    heading: 'Sun exposure can affect the skin in several visible ways.',
    lead: 'Visible effects of sun exposure may appear as isolated spots, a broader change in color, a change in surface texture, or more than one of these together.',
    detail: 'Light-based services, peels, microneedling, and skin care have different roles within that picture. The most useful place to begin is the specific feature, not the name of a device you may have heard about.',
    distinction: 'Identify the change that stands out most: a spot, uneven color, or surface texture.',
    consultationHeading: 'The most noticeable change is the best place to start.',
    consultationPrompt: 'Describe whether an isolated spot, a broader color change, or a rougher surface is most visible. If you see more than one, include that too.',
  },
  texture: {
    heading: '“Texture” can describe several different skin changes.',
    lead: 'You may mean roughness you can feel, visible pores, fine surface lines, or scar-related irregularity. More than one can be present in the same area.',
    detail: 'Surface treatments, microneedling, and device-based services address different parts of that picture. Naming the physical change makes their differences easier to understand.',
    distinction: 'Notice whether the surface feels rough, looks pitted, shows fine lines, or has a mix of those features.',
    consultationHeading: 'Describe what you see and what you can feel.',
    consultationPrompt: 'The change may be mainly roughness, visible pores, fine surface lines, scar-related irregularity, or a combination of these.',
  },
  'stretch-marks': {
    heading: 'Stretch marks vary in color, age, and texture.',
    lead: 'Stretch marks are scar-related texture changes. Their color, age, and texture can vary from one person—and one area—to another.',
    detail: 'Microneedling and fractional radiofrequency microneedling are separate technologies. Research continues, but it does not support a promise of complete or uniform resolution.',
    distinction: 'Color, age, texture, and location all affect what a treatment can realistically improve.',
    consultationHeading: 'Current color and texture guide what is realistic to expect.',
    consultationPrompt: 'Share the area, when you first noticed the marks, and whether color or texture is more visible now.',
  },
};

export const getConcernEducation = (slug: string): ConcernEducation | undefined =>
  CONCERN_EDUCATION[slug];
