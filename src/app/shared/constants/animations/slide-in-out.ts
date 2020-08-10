import {
  trigger, state, style, transition,
  animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
  trigger('slideInOut', [
    state('in', style({
      'max-height': '1000px', 'opacity': '1', 'visibility': 'visible'
    })),
    state('out', style({
      'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
    })),
    transition('in => out', [group([
      animate('500ms ease-in-out', style({
        'max-height': '100px'
      })),
      animate('600ms ease-in-out', style({
        'max-height': '50px',
      })),
      animate('800ms ease-in-out', style({
        'visibility': 'hidden'
      }))
    ]
    )]),
    transition('out => in', [group([
      animate('1ms ease-in-out', style({
        'visibility': 'visible'
      })),
      animate('600ms ease-in-out', style({
        'max-height': '1000px'
      })),
      animate('800ms ease-in-out', style({
        'opacity': '1'
      }))
    ]
    )])
  ]),
]