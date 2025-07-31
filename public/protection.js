// Website Protection Script
// Prevents common copying and cloning attempts

(function() {
    'use strict';

    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, and other dev tools
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I (Dev Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+C (Element Inspector)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+A (Select All)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+P (Print)
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
    });

    // Disable image dragging and saving
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            img.setAttribute('draggable', 'false');
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
        });
    });

    // Detect developer tools
    let devtools = {
        open: false,
        orientation: null
    };
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > 160 || 
            window.outerWidth - window.innerWidth > 160) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%cWebsite Protected', 'color: red; font-size: 50px; font-weight: bold;');
                console.log('%cThis website is protected against unauthorized access.', 'color: red; font-size: 16px;');
            }
        } else {
            devtools.open = false;
        }
    }, 500);

    // Clear console periodically
    setInterval(function() {
        console.clear();
    }, 1000);

    // Disable printing
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable copy shortcuts
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });

    // Add CSS to prevent text selection
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        
        img {
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
            pointer-events: none !important;
        }
        
        /* Hide image when trying to save */
        img::selection {
            background: transparent !important;
        }
        
        /* Disable highlighting */
        ::selection {
            background: transparent !important;
        }
        
        ::-moz-selection {
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);

    // Domain checking (optional - uncomment and set your domain)
    /*
    if (window.location.hostname !== 'your-domain.com') {
        document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50px;">Unauthorized Access</h1>';
        return;
    }
    */

})();