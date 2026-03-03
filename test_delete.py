"""
Test Playwright : verification des suppressions dans l'historique
"""
from playwright.sync_api import sync_playwright
import json

FILE_URL = "file:///K:/Antigravity/Programme%20muscu/index.html"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    dialogs_seen = []
    def handle_dialog(dialog):
        print(f"DIALOG TYPE={dialog.type} MSG={dialog.message}")
        dialogs_seen.append({'type': dialog.type, 'message': dialog.message})
        dialog.accept()
    page.on("dialog", handle_dialog)
    
    console_errors = []
    page.on("console", lambda msg: console_errors.append(f"{msg.type}: {msg.text}") if msg.type in ['error', 'warning'] else None)
    
    page.goto(FILE_URL)
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    
    page.evaluate("""() => {
        const fakeHistory = [{
            id: 1234567890,
            date: 1234567890,
            dayId: 'lundi',
            dayName: 'Lundi',
            data: {
                dc: [
                    { kg: '80', reps: '10', checked: true },
                    { kg: '80', reps: '8', checked: true }
                ]
            }
        }];
        localStorage.setItem('wolfy_workout_history', JSON.stringify(fakeHistory));
    }""")
    
    page.reload()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    
    history_btn = page.locator('.nav-btn[data-view="history"]')
    history_btn.click()
    page.wait_for_timeout(500)
    
    delete_btns = page.locator('.btn-delete-history').all()
    print(f"Nombre de boutons de suppression: {len(delete_btns)}")
    
    for i, btn in enumerate(delete_btns):
        try:
            onclick = btn.get_attribute('onclick')
            print(f"  Bouton {i}: onclick={onclick}")
        except:
            print(f"  Bouton {i}: inaccessible")
    
    is_delete_available = page.evaluate("typeof window.deleteHistorySession === 'function'")
    print(f"deleteHistorySession disponible: {is_delete_available}")
    
    print("Appel direct de deleteHistorySession(1234567890)")
    page.evaluate("window.deleteHistorySession(1234567890)")
    page.wait_for_timeout(1000)
    
    print(f"Dialogues detectes: {dialogs_seen}")
    remaining = page.evaluate("JSON.parse(localStorage.getItem('wolfy_workout_history') || '[]')")
    print(f"Donnees restantes: {remaining}")
    
    if console_errors:
        print(f"Erreurs console: {console_errors}")
    
    browser.close()
print("Test termine.")
