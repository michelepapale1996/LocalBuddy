package com.localbuddy;
/**
 * Overrides the default PushNotification implementation to create a
 * notification with a layout similar to the 'The Big Meeting' notification,
 * showing in the screenshot above.
 */
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.support.v4.app.NotificationCompat;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import android.R;
import android.R.color;
import android.R.drawable;
import android.R.string;
import com.facebook.react.bridge.ReactContext;
import com.wix.reactnativenotifications.core.notification.*;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.AppLifecycleFacade.AppVisibilityListener;
import com.wix.reactnativenotifications.core.AppLifecycleFacadeHolder;
import com.wix.reactnativenotifications.core.InitialNotificationHolder;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.NotificationIntentAdapter;
import com.wix.reactnativenotifications.core.ProxyService;
import android.content.res.Resources;
import static com.wix.reactnativenotifications.Defs.NOTIFICATION_OPENED_EVENT_NAME;
import static com.wix.reactnativenotifications.Defs.NOTIFICATION_RECEIVED_EVENT_NAME;
import static com.wix.reactnativenotifications.Defs.NOTIFICATION_RECEIVED_FOREGROUND_EVENT_NAME;

public class MyPushNotification extends PushNotification {

    private Context context;

    public MyPushNotification(Context context, Bundle bundle, AppLifecycleFacade appLifecycleFacade, AppLaunchHelper appLaunchHelper, JsIOHelper jsIoHelper) {
        super(context, bundle, appLifecycleFacade, appLaunchHelper, jsIoHelper);
        this.context = context;
    }

    @Override
    protected Notification.Builder getNotificationBuilder(PendingIntent intent) {

        Intent notificationIntent = new Intent(this.context, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this.context,
                        0, notificationIntent,
                        PendingIntent.FLAG_CANCEL_CURRENT);

        // First, get a builder initialized with defaults from the core class.
        final Notification.Builder builder = super.getNotificationBuilder(intent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentTitle(mNotificationProps.asBundle().getString("opponentName"))
            .setContentText(mNotificationProps.asBundle().getString("message"))
            .setContentIntent(contentIntent);

        return builder;
    }
}