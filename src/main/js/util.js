'use strict';

const i18n = require('./i18n.js');
const {initNotification, showWarning, showError} = require('./notification.js');

async function fetchWithRedirect(url, options, error, success) {

    const response = await fetch(url, options);
    if (response.redirected) {
        window.location = response.url;
    } else if (response.ok) {
        if (success) {
            success();
        }
        if (response.status != 204) {
            return await response.json();
        }
    } else {
        if (error) {
            error();
        }
    }
}

function initCommand($button, command, deviceId, options) {
    options = options || {};
    if (options.init) {
        options.init();
    }
    $button.off('click');
    $button.click(async () => {
        if (options.before) {
            options.before();
        }
        await fetchWithRedirect(`/api/device/${deviceId}/command`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({type: command, payload: options.payload ? options.payload() : []})
        }, () => {
            showError(i18n.translate('Command is not completed.'));
            if (options.error) {
                options.error();
            }
        }, () => {
            if (options.after) {
                options.after();
            }
        });
    });
}

function initConfig($input, $elements, parameter, config, deviceId, options) {
    options = options || {};
    if (options.init) {
        options.init();
    } else {
        if (options.initValue) {
            $input.val(options.initValue());
        } else {
            let done = false;
            config.filter(c => c.parameter == parameter).forEach(c => {
                $input.val(c.value);
                done = true;
            });
            if (done == false && options.defaultValue) {
                $input.val(options.defaultValue());
            }
        }
    }
    if (!Array.isArray($elements)) {
        $elements = [$elements];
    }
    $elements.forEach($element => {
        $element.off('click');
        $element.click(async () => {
            if (options.before) {
                options.before();
            }
            await fetchWithRedirect(`/api/device/${deviceId}/config`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({parameter: parameter, value: options.value ? options.value() : $input.val()})
            }, () => {
                showError(i18n.translate('Command is not completed.'));
                if (options.error) {
                    options.error();
                }
            }, () => {
                if (options.after) {
                    options.after();
                }
            });
        });
    });
}

function initCheck($check, parameter, config, deviceId) {
    config.filter(c => c.parameter == parameter).forEach(c => $check[0].checked = c.value == '1');
    $check.off('change');
    $check.click(async () => {
        const value = $check[0].checked == true ? '1' : '0';
        await fetchWithRedirect(`/api/device/${deviceId}/config`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({parameter: parameter, value: value})
        }, () => {
            $check[0].checked = !$check[0].checked;
            showError(i18n.translate('Command is not completed.'));
        });
    });
}

async function showInputToken(deviceId) {

    const $modalToken = $('#input-token');

    const $closeToken = $('#input-token-close');
    const $executeToken = $('#input-token-execute');

    function hide() {
        $closeToken.off('click');
        $executeToken.off('click');
        $modalToken.modal('hide');
    }

    return new Promise(resolve => {

        $modalToken.on('shown.bs.modal', function onShow() {
            $modalToken.off('shown.bs.modal', onShow);
            $closeToken.click(function () {
                hide();
                resolve(null);
            });
            $executeToken.click(async function () {
                const token = $('#input-token-input').val();
                await fetchWithRedirect(`/api/device/${deviceId}/execute/${token}`, {}, () => {
                    showError(i18n.translate('Command is not completed.'));
                });
                hide();
                resolve(null);
            });
        });

        $modalToken.modal({
            backdrop: 'static',
            focus: true,
            keyboard: false,
            show: true
        });
    });
}


module.exports = {showInputToken, fetchWithRedirect, initCommand, initConfig, initCheck};