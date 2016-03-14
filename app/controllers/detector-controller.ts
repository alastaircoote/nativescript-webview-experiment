import {setTimeout, clearTimeout} from 'timer';

export const DetectorController = UIViewController.extend({
    init: function() {
        this.webview = UIWebView.new().initWithFrame(UIScreen.mainScreen().bounds);
        this.webview.delegate = this;
        this.view = this.webview;
        this.availableLinks = [];
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
        let allLinksResponse = this.webview.stringByEvaluatingJavaScriptFromString(`
            window.onerror = function(err) {alert(err)};
            (function() {
                var allArticleLinks = document.querySelectorAll('a[href^="/2016"]');
                
                return JSON.stringify(Array.prototype.slice.call(allArticleLinks).map(function(a) {
                    return a.href;
                }));
                
            })();
        `);
        let parsedAllLinks = JSON.parse(allLinksResponse);
        
        // Some pages don't have any links on them, so we keep a cache of all the article links
        // we find, then select from them.
        
        for (let link of parsedAllLinks) {
            if (this.availableLinks.indexOf(link) === -1) {
                this.availableLinks.push(link);
            }
        }
        
        let indexToSelect = Math.floor(Math.random() * this.availableLinks.length);
        
        let [removedLink] = this.availableLinks.splice(indexToSelect, 1);
        
        console.log("Sending to", removedLink);
        this.webview.stringByEvaluatingJavaScriptFromString(`window.location = '${removedLink}'`);
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