let game;

async function initGame() {
    if (typeof katex === 'undefined') {
        setTimeout(initGame, 100);
        return;
    }
    
    if (typeof loadQuestions === 'undefined') {
        setTimeout(initGame, 100);
        return;
    }
    
    await loadQuestions();
    
    if (!questionsLoaded) {
        setTimeout(initGame, 100);
        return;
    }
    
    game = new Game();
    
    game.uiManager.showTutorial();
    
    document.getElementById('retry-level-btn').addEventListener('click', () => {
        game.restartGame();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            game.useTimeFreeze();
        }
        
        if (e.key === 'Escape') {
            document.getElementById('tower-menu').classList.add('hidden');
            document.getElementById('upgrade-menu').classList.add('hidden');
        }
    });
}

window.addEventListener('DOMContentLoaded', initGame);