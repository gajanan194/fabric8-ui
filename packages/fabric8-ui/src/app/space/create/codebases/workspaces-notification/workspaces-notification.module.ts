import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkspacesNotificationComponent } from './workspaces-notification.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [WorkspacesNotificationComponent],
  exports: [WorkspacesNotificationComponent],
})
export class WorkspacesNotificationModule {}
