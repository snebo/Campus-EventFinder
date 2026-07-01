import { Routes } from '@angular/router';

import { CreateEventPageComponent } from './create-event-page.component';
import { UnsavedChangesGuard } from '../../shared/guards/unsaved-changes.guard';

export const CREATE_EVENT_ROUTES: Routes = [{ path: '', component: CreateEventPageComponent, canDeactivate: [UnsavedChangesGuard] }];
