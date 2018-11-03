function save_options() {
    var format = document.getElementById('date_format').checked;
    chrome.storage.sync.set({
        date_uk: format
    }, function () {
        // update background
        chrome.runtime.sendMessage({date_uk: format});
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Saving option...';
        setTimeout(function () {
            status.textContent = '';
            window.close();
        }, 500);
    });
}

function restore_options () {
    chrome.storage.sync.get({
        date_uk: false
    }, function (items) {
        document.getElementById('date_format').checked = items.date_uk;
    })
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('input[id=date_format]').addEventListener('change', save_options);
