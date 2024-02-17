import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[appOnlyAdmin]',
  standalone: true,
})
export class OnlyAdminDirective {
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private authService = inject(AuthService);

  constructor() {
    if (this.authService.isAdmin) {
      if (this.viewContainerRef.length === 0) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainerRef.clear();
    }
  }
}
