import { Injectable, inject } from '@angular/core';
import { ConfirmationService, Message, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  success({
    title = 'Success',
    message = 'Completed Successfully',
  } = {}): void {
    this.messageService.clear();
    this.messageService.add({
      detail: message,
      summary: title,
      severity: 'success',
      life: 5_000,
    });
  }

  confirmation({
    header = 'Are you sure?',
    message = 'Are you sure you want to continue?',
    accept = () => {},
    reject = () => {},
  } = {}): void {
    this.confirmationService.confirm({
      message,
      header,
      accept,
      reject,
      acceptButtonStyleClass: 'p-button-primary p-button-sm',
      rejectButtonStyleClass: 'p-button-danger p-button-sm',
    });
  }
}
