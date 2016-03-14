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
            console.log('setting timer...')
            this.changePageTimeout = setTimeout(this.moveToRandomArticleLink.bind(this), 20000);
        }
    },
    moveToRandomArticleLink: function() {
        // Reset our timeout so it'll run again on next load
        clearTimeout(this.changePageTimeout);
        this.changePageTimeout = null;
        var allLinksResponse = this.webview.stringByEvaluatingJavaScriptFromString(`
            window.onerror = function(err) {alert(err)};
            (function() {
                var allArticleLinks = document.querySelectorAll('a[href^="/2016"]');
                
                return JSON.stringify(Array.prototype.slice.call(allArticleLinks).map(function(a) {
                    return a.href;
                }));
                
            })();
        `);
        var parsedAllLinks = JSON.parse(allLinksResponse);
        
        // Some pages don't have any links on them, so we actually cache the links used on the last
        // page. If there are no new links, we return to the previous list and select a different link.
        
        if (parsedAllLinks.length > 0) {
            this.possibleLinks = parsedAllLinks;
        }
        var selectedLink = this.possibleLinks[Math.floor(Math.random() * this.possibleLinks.length)];
        
        console.log("Sending to", selectedLink);
        this.webview.stringByEvaluatingJavaScriptFromString(`window.location = '${selectedLink}'`);
    },
    webViewShouldStartLoadWithRequestNavigationType: function(webView: UIWebView, request: NSURLRequest, navigationType: number) {
        if (request.URL.host === 'itunes.apple.com') {
            // This was an attempt to redirect the user to the App Store.
            // Do something here.
            clearTimeout(this.changePageTimeout);
            console.log('app link?', request.URL.absoluteString);
            this.webview.stringByEvaluatingJavaScriptFromString("alert('App ad?')");
            return false;
        }
        return true;
    }
}, {
     protocols: [UIWebViewDelegate]
})