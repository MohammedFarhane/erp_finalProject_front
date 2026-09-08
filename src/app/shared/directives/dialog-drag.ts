import { Directive, inject } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appDialogDrag]',
  hostDirectives: [CdkDrag],
  host: { class: 'dialog-drag' },
})
export class DialogDrag {
  constructor() {
    inject(CdkDrag).rootElementSelector = '.cdk-overlay-pane';
  }
}
