import {DetectorController} from './controllers/detector-controller';

const App = NSObject.extend({
    applicationDidFinishLaunchingWithOptions: function (application, launchOptions) {
        
        this.setBrowserUserAgent();
       
        this.window = UIWindow.new();
        this.detectorController = DetectorController.new();
        
        this.window.rootViewController = this.detectorController;
        this.window.frame = UIScreen.mainScreen().bounds;
        this.window.makeKeyAndVisible();
        
        return true;
    },
    setBrowserUserAgent: function() {
        
        // By default UIWebView's user agent actually differs slightly from Safari itself. In order
        // to match the "default" experience, we override the user agent.
        
        let vals = new NSMutableArray();
        vals.addObject("Mozilla/5.0 (iPhone; CPU iPhone OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H141 Safari/600.1.4");
        
        let keys = new NSMutableArray();
        keys.addObject("UserAgent");
        
        let defaults = new NSDictionary(vals, keys);
        NSUserDefaults.standardUserDefaults().registerDefaults(defaults);
    }
}, {
    protocols: [UIApplicationDelegate]
});

UIApplicationMain(0, null, null, NSStringFromClass(App));