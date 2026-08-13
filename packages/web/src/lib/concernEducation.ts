export interface ConcernEducation {
  heading: string;
  lead: string;
  detail: string;
  distinction: string;
  consultationHeading: string;
  consultationPrompt: string;
}

const CONCERN_EDUCATION: Readonly<Record<string, ConcernEducation>> = {
  aging: {
    heading: 'What catches your eye first?',
    lead: 'You may notice a rougher surface, uneven color, a line that appears with expression, or less support through one area of the face.',
    detail: 'Surface treatments, pigment-focused services, neurotoxins, and volume-focused services each begin with a different visible change. Seeing more than one change does not mean every service belongs in the same visit.',
    distinction: 'Name the change that stands out most: surface, pigment, movement, or volume. A simple photograph or description is enough to start.',
    consultationHeading: 'Bring the change you notice most.',
    consultationPrompt: 'A photograph or a simple description—roughness, uneven color, an expression line, or less support—gives us a useful place to begin.',
  },
  'dark-circles': {
    heading: 'Under-eye darkness may be color, shadow, or both.',
    lead: 'What looks like a dark circle in the mirror may be pigment, thin or translucent skin showing visible vessels, a structural shadow, or a combination.',
    detail: 'A color change and a hollow can sit in the same place without calling for the same approach. Some under-eye concerns also sit outside what an aesthetic service can change.',
    distinction: 'The first useful distinction is what you can see: pigment, visible vessels, structural shadow, or more than one.',
    consultationHeading: 'Describe the darkness in your own words.',
    consultationPrompt: 'Tell us whether it looks more like color, visible vessels, hollowing, or shadow. You do not need to choose an under-eye treatment first.',
  },
  'fine-lines-laxity': {
    heading: 'The same area can show more than one kind of line.',
    lead: 'A line may come from repeated facial movement, skin texture, or a change in facial support. Laxity is another visible change, even when it appears nearby.',
    detail: 'House of Rose lists neurotoxins for movement-related lines, fillers for selected volume changes, and resurfacing or device services for surface texture and laxity. The location alone does not tell you which of those changes you are seeing.',
    distinction: 'Name what you notice most: movement, a surface crease, less volume, or looser skin.',
    consultationHeading: 'Point to the line or change that bothers you.',
    consultationPrompt: 'Tell us whether it appears with expression, stays visible at rest, or sits beside a change in texture, volume, or laxity.',
  },
  'acne-scarring': {
    heading: 'Look at the shape and depth of the scar.',
    lead: 'Atrophic acne scars are commonly described as ice-pick, rolling, or boxcar scars. More than one shape can appear in the same area.',
    detail: 'A narrow depression, a broader edge, and a rolling change in texture do not present the same way. Active breakouts add a separate question because they describe what is happening now, not only the texture left behind.',
    distinction: 'When you look from the front and from the side, notice whether the texture appears narrow, broad-edged, rolling, or mixed.',
    consultationHeading: 'Show us the texture from more than one angle.',
    consultationPrompt: 'A clear photograph from the front and side—and a note about any breakouts still appearing—helps us understand both the scar shape and what is active now.',
  },
  'active-acne': {
    heading: 'Are new breakouts appearing, or are you seeing what they left behind?',
    lead: 'A new breakout is active now. Discoloration and established scars can remain after a breakout has settled, and both may be visible at the same time.',
    detail: 'The current Face Reality program is the House of Rose option for active breakouts. Scar-focused services address established texture, so seeing both concerns does not mean one appointment is expected to do both jobs.',
    distinction: 'Notice where new breakouts are forming and where the skin is calm but still shows color or texture.',
    consultationHeading: 'Tell us what is new and what has remained.',
    consultationPrompt: 'Deep, painful, widespread, or actively scarring breakouts need medical evaluation before an esthetics program is considered. Otherwise, share where new breakouts are appearing and whether discoloration, indentations, or other established texture remain after they settle.',
  },
  hyperpigmentation: {
    heading: 'Is it one spot, a diffuse patch, or a mark left after inflammation?',
    lead: 'Uneven pigment can differ in depth, pattern, trigger, and response to light-based or exfoliating treatments.',
    detail: 'A brown spot, a broader area of uneven color, and discoloration after a breakout may look similar at first glance. The visible pattern and what preceded it give the provider more useful information than the word “pigmentation” alone.',
    distinction: 'Notice whether the color is isolated or spread out, and whether it followed a breakout, irritation, or time in the sun.',
    consultationHeading: 'Show us the color and its pattern.',
    consultationPrompt: 'Tell us whether you see a single spot, a diffuse patch, or discoloration left after inflammation—and when you first noticed it.',
  },
  'volume-loss': {
    heading: 'Where does the face look less full or supported?',
    lead: 'Less fullness or support can look like a hollow, fold, or shift in facial shape. A line that appears mainly with expression points to the neurotoxin menu instead.',
    detail: 'House of Rose dermal fillers use manufactured hyaluronic-acid gels. Injectable PRF is prepared from a small sample of your own blood. Botox and Daxxify address movement-related lines.',
    distinction: 'A hollow, fold, and expression line can appear close together. Describe each one you notice rather than trying to select a product first.',
    consultationHeading: 'Tell us where the face looks less supported.',
    consultationPrompt: 'Describe the hollow, fold, or shift in shape that you notice. We can then explain the difference between dermal filler, injectable PRF, and movement-related services.',
  },
  'sun-damage': {
    heading: 'Do spots, uneven color, or a rougher surface stand out most?',
    lead: 'Visible effects of sun exposure may appear as isolated spots, a broader change in color, a change in surface texture, or more than one of these together.',
    detail: 'Light-based services, peels, microneedling, and skin care have different roles within that picture. The most useful place to begin is the feature you notice—not the name of a device you may have heard about.',
    distinction: 'Look for the one change your eye returns to first: a spot, uneven color, or surface texture.',
    consultationHeading: 'Tell us what your eye goes to first.',
    consultationPrompt: 'Describe whether an isolated spot, a broader color change, or a rougher surface is most visible. If you see more than one, include that too.',
  },
  texture: {
    heading: 'What does “texture” look like up close?',
    lead: 'You may mean roughness you can feel, visible pores, fine surface lines, or scar-related irregularity. More than one can be present in the same area.',
    detail: 'Surface treatments, microneedling, and device-based services address different parts of that picture. Naming the physical change makes their differences easier to understand.',
    distinction: 'Notice whether the surface feels rough, looks pitted, shows fine lines, or has a mix of those features.',
    consultationHeading: 'Describe what you see and what you can feel.',
    consultationPrompt: 'Tell us whether the change is mainly roughness, visible pores, fine surface lines, scar-related irregularity, or a combination.',
  },
  'stretch-marks': {
    heading: 'How do the marks look now?',
    lead: 'Stretch marks are scar-related texture changes. Their color, age, and texture can vary from one person—and one area—to another.',
    detail: 'Microneedling and fractional radiofrequency microneedling are separate technologies. Research continues, but it does not support a promise of complete or uniform resolution.',
    distinction: 'Color, age, texture, and location give a clearer picture of the marks than a promise that they can simply disappear.',
    consultationHeading: 'Show us the marks as they are today.',
    consultationPrompt: 'Share the area, when you first noticed the marks, and whether color or texture is more visible now.',
  },
};

export const getConcernEducation = (slug: string): ConcernEducation | undefined =>
  CONCERN_EDUCATION[slug];
