import { HttpClientModule } from '@angular/common/http';
import { ApplicationRef, ErrorHandler, Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MomentModule } from 'angular2-moment';
import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { Logger, Notifications } from 'ngx-base';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AreaService, CollaboratorService, Contexts, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { AuthenticationService, PermissionService, UserService } from 'ngx-login-client';
import { RestangularModule } from 'ngx-restangular';
import { WidgetsModule } from 'ngx-widgets';
import { ActionModule } from 'patternfly-ng/action';
import { EmptyStateModule } from 'patternfly-ng/empty-state';
import { NotificationService, ToastNotificationListModule } from 'patternfly-ng/notification';
import { StaticInjector } from 'ngx-launcher';
import {
  // Base functionality for the runtime console
  KubernetesRestangularModule,
  KubernetesStoreModule,
  OnLogin,
  SpaceNamespace,
} from '../a-runtime-console/index';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import './rxjs-extensions';

/*
 * Platform and Environment providers/directives/pipes
 */
import { AppRoutingModule } from './app-routing.module';
import { ENV_PROVIDERS } from './environment';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

// Header
import { FeatureFlagResolver, EnableFeatureService } from 'ngx-feature-flag';
import { HeaderComponent } from './layout/header/header.component';
import { MenusService } from './layout/header/menus.service';

// Shared Services
import { AboutService } from './shared/about.service';
import { ProviderService } from './shared/account/provider.service';
import { AnalyticService } from './shared/analytics.service';
import { ApiLocatorService } from './shared/api-locator.service';
import { authApiUrlProvider, witApiProxyProvider } from './shared/auth-api.provider';
import { AuthGuard } from './shared/auth-guard.service';
import { BrandingService } from './shared/branding.service';
import { AuthUserResolve } from './shared/common.resolver';
import { fabric8UIConfigProvider } from './shared/config/fabric8-ui-config.service';
import { ContextCurrentUserGuard } from './shared/context-current-user-guard.service';
import { ContextResolver } from './shared/context-resolver.service';
import { ContextService } from './shared/context.service';
import { forgeApiUrlProvider } from './shared/forge-api.provider';
import { buildToolDetectorApiUrlProvider } from './shared/build-tool-detector-api.provider';
import { jenkinsApiUrlProvider } from './shared/jenkins-api.provider';
import { LoginService } from './shared/login.service';
import { NotificationsService } from './shared/notifications.service';
import { ProfileResolver } from './shared/profile-resolver.service';
import { realmProvider } from './shared/realm-token.provider';
import { Fabric8RuntimeConsoleService } from './shared/runtime-console/fabric8-runtime-console.service';
import { Fabric8UIOnLogin } from './shared/runtime-console/fabric8-ui-onlogin.service';
import { Fabric8UISpaceNamespace } from './shared/runtime-console/fabric8-ui-space-namespace.service';
import { Fabric8RuntimeConsoleResolver } from './shared/runtime-console/oauth-config-store-guard.resolver';
import { OAuthConfigStoreGuard } from './shared/runtime-console/oauth-config-store-guard.service';
import { PipelinesService } from './shared/runtime-console/pipelines.service';
import { SpaceNamespaceService } from './shared/runtime-console/space-namespace.service';
import { SpacesService } from './shared/spaces.service';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { WindowService } from './shared/window.service';
import { witApiUrlProvider } from './shared/wit-api.provider';

// Component Services
import { ConfigStore } from './base/config.store';
import { ErrorService } from './layout/error/error.service';
import { ProfileService } from './profile/profile.service';

// App launcher
import { AddAppOverlayModule } from './space/add-app-overlay/add-app-overlay.module';
import { AddSpaceOverlayModule } from './space/add-space-overlay/add-space-overlay.module';

// About Modal
import { TooltipModule } from 'ngx-bootstrap';
import { FeatureTogglesService } from 'ngx-feature-flag';
import { FeatureFooterModule } from './feature-flag/notification-footer/feature-footer.module';
import { FeatureAcknowledgementService } from './feature-flag/service/feature-acknowledgement.service';
import { GettingStartedService } from './getting-started/services/getting-started.service';
import { AboutModalModule } from './layout/about-modal/about-modal.module';
import { RavenExceptionHandler } from './shared/exception.handler';
import { HttpInterceptorProviders } from './shared/interceptors/index';
import { RequestCache } from './shared/request-cache.service';
import { togglesApiUrlProvider } from './shared/toggles.api.provider';

/**
 * Import application wide styles
 */
import '../assets/stylesheets/fabric8-ui-global-overrides.less';
import '../assets/stylesheets/shared/osio.less';

// Application wide providers
const APP_PROVIDERS = [...APP_RESOLVER_PROVIDERS, AppState];

export type StoreType = {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  imports: [
    BootstrapModule,
    // import (in alphabetical order) other modules with the components, directives and pipes
    // needed by the components in this module
    AboutModalModule,
    ActionModule,
    AddAppOverlayModule,
    AddSpaceOverlayModule,
    BrowserAnimationsModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    EffectsModule.forRoot([]),
    EmptyStateModule,
    FormsModule,
    HttpClientModule,
    KubernetesRestangularModule,
    KubernetesStoreModule,
    LocalStorageModule.withConfig({
      prefix: 'fabric8',
      storageType: 'localStorage',
    }),

    MomentModule,
    ToastNotificationListModule,
    ReactiveFormsModule,
    RestangularModule,
    RouterModule,
    StackDetailsModule,
    WidgetsModule,
    StoreModule.forRoot({}),
    AppRoutingModule,
    // Must be at the end

    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    FeatureFooterModule,
  ],
  declarations: [
    // declare which components, directives and pipes belong to the module
    AppComponent,
    HeaderComponent,
  ],
  providers: [
    // expose our Services and Providers into Angular's dependency injection
    // Broadcaster must come first
    BsDropdownConfig,
    ENV_PROVIDERS,
    AboutService,
    AnalyticService,
    APP_PROVIDERS,
    ApiLocatorService,
    AreaService,
    authApiUrlProvider,
    AuthenticationService,
    AuthGuard,
    AuthUserResolve,
    BrandingService,
    CollaboratorService,
    ConfigStore,
    ContextCurrentUserGuard,
    ContextResolver,
    ContextService,
    {
      provide: Contexts,
      useExisting: ContextService,
    },
    {
      provide: ErrorHandler,
      useClass: RavenExceptionHandler,
    },
    EnableFeatureService,
    ErrorService,
    FeatureFlagResolver,
    FeatureTogglesService,
    FeatureAcknowledgementService,
    Fabric8RuntimeConsoleResolver,
    Fabric8RuntimeConsoleService,
    fabric8UIConfigProvider,
    {
      provide: OnLogin,
      useClass: Fabric8UIOnLogin,
    },
    forgeApiUrlProvider,
    buildToolDetectorApiUrlProvider,
    GettingStartedService,
    HttpInterceptorProviders,
    jenkinsApiUrlProvider,
    Logger,
    LoginService,
    MenusService,
    NotificationService,
    NotificationsService,
    {
      provide: Notifications,
      useExisting: NotificationsService,
    },
    OAuthConfigStoreGuard,
    PermissionService,
    PipelinesService,
    ProfileResolver,
    ProfileService,
    ProviderService,
    realmProvider,
    RequestCache,
    SpacesService,
    SpaceService,
    {
      provide: Spaces,
      useExisting: SpacesService,
    },
    SpaceNamespaceService,
    {
      provide: SpaceNamespace,
      useClass: Fabric8UISpaceNamespace,
    },
    ssoApiUrlProvider,
    togglesApiUrlProvider,
    UserService,
    WindowService,
    witApiUrlProvider,
    witApiProxyProvider,
  ],
  schemas: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState, injector: Injector) {
    /* Below line is needed to get the broadcaster instance from AppModule which is
    used in `ngx-launcher` to broadcast events for telemetry */
    StaticInjector.setInjector(injector);
  }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
