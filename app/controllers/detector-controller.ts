import {setTimeout, clearTimeout} from 'timer';

export const DetectorController = UIViewController.extend({
    init: function() {
        this.webview = UIWebView.new().initWithFrame(UIScreen.mainScreen().bounds);
        this.webview.delegate = this;
        this.view = this.webview;
        return this.super.init();
    },
    viewDidAppear: function() {
        let url = NSURL.URLWithString("http://mobile.nytimes.com/");
        let request = NSURLRequest.requestWithURL(url);
        this.webview.loadRequest(request);
    },
    webViewDidFinishLoad: function(webView:UIWebView) {
        
        // The webview fires webViewDidFinishLoad multiple times - I suspect because it's also
        // counting iframe loads. So we need to make sure we only set this timer once - then we
        // set it to null once it actually fires.
        
        if (!this.changePageTimeout) {
            this.changePageTimeout = setTimeout(this.moveToRandomArticleLink.bind(this), 30000);
        }
    },
    moveToRandomArticleLink: function() {
        // Reset our timeout so it'll run again on next load
        clearTimeout(this.changePageTimeout);
        this.changePageTimeout = null;
        
        this.webview.stringByEvaluatingJavaScriptFromString(`
            (function() {
                var allArticleLinks = document.querySelectorAll('a[href^="/2016"]');
                var selectedLink = allArticleLinks[Math.floor(Math.random() * allArticleLinks.length)];
                window.location = selectedLink.href;
            })();
        `)
    },
    webViewShouldStartLoadWithRequestNavigationType: function(webView: UIWebView, request: NSURLRequest, navigationType: number) {
        if (request.URL.host === 'itunes.apple.com') {
            // This was an attempt to redirect the user to the App Store.
            // Do something here.
            return false;
        }
        return true;
    }
}, {
     protocols: [UIWebViewDelegate]
})