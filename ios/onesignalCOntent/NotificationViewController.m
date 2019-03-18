//
//  NotificationViewController.m
//  onesignalCOntent
//
//  Created by Syneins Enterprise Systems on 07/03/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "NotificationViewController.h"
#import <UserNotifications/UserNotifications.h>
#import <UserNotificationsUI/UserNotificationsUI.h>

@interface NotificationViewController () <UNNotificationContentExtension>

@property IBOutlet UILabel *label;
@property (weak, nonatomic) IBOutlet UIImageView *bannerImage;

@end

@implementation NotificationViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any required interface initialization here.
}

- (void)didReceiveNotification:(UNNotification *)notification {
  
  /*NSURL *url = [NSURL URLWithString:notification.request.content.body];
  
  NSLog(@"notificationData: %@", notification);
  
  NSData *data = [NSData dataWithContentsOfURL:url];
  
  NSLog(@"imageData: %@", data);
  
  UIImage *image = [UIImage imageWithData:data];
  
  NSLog(@"image: %@", image);
  
  self.bannerImage.image = image;
    self.label.text = notification.request.content.body;*/
}

@end
