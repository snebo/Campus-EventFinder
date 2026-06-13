import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  LucideAngularModule,
  GraduationCap,
  Info,
  Eye,
  EyeOff,
  X,
  LoaderCircle,
  Menu,
  Search,
  ChevronDown,
  Clock,
  MapPin,
  Calendar,
  Image,
  Bookmark,
  BookmarkCheck,
  User,
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        GraduationCap,
        Info,
        Eye,
        EyeOff,
        X,
        LoaderCircle,
        Menu,
        Search,
        ChevronDown,
        Clock,
        MapPin,
        Calendar,
        Image,
        Bookmark,
        BookmarkCheck,
        User,
      })
    ),
  ]
};
