import { Directive, inject } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appDialogDrag]',
  hostDirectives: [CdkDrag],
  host: { style: 'cursor: move; user-select: none' },
})
export class DialogDrag {
  constructor() {
    inject(CdkDrag).rootElementSelector = '.cdk-overlay-pane';
  }
}
