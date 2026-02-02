/**
 * Classe pour générer des questions mathématiques selon le type d'opération
 */
class QuestionGenerator {
    /**
     * @param {Object} config - Configuration de l'opération
     * @param {string} config.type - Type d'opération (multiplication, addition, subtraction, division, combined)
     * @param {number[]} config.tables - Tables de multiplication/division à utiliser
     * @param {number} config.digitCount - Nombre de chiffres (1 ou 2) pour addition/soustraction
     * @param {boolean} config.allowNegatives - Autoriser les résultats négatifs (soustraction)
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Génère une question selon le type d'opération configuré
     * @param {Set<number>} existingAnswers - Réponses déjà présentes à éviter (optionnel)
     * @returns {Object} - { question: string, answer: number, operator: string }
     */
    generate(existingAnswers = new Set()) {
        let result;
        let attempts = 0;
        const maxAttempts = 50;

        do {
            switch (this.config.type) {
                case 'multiplication':
                    result = this.generateMultiplication();
                    break;
                case 'addition':
                    result = this.generateAddition();
                    break;
                case 'subtraction':
                    result = this.generateSubtraction();
                    break;
                case 'division':
                    result = this.generateDivision();
                    break;
                case 'combined':
                    result = this.generateCombined();
                    break;
                default:
                    result = this.generateMultiplication();
            }
            attempts++;
        } while (existingAnswers.has(result.answer) && attempts < maxAttempts);

        return result;
    }

    /**
     * Génère une multiplication
     * @returns {Object}
     */
    generateMultiplication() {
        const tables = this.config.tables || [1, 2, 3, 4, 5];
        const table = tables[Math.floor(Math.random() * tables.length)];
        const multiplier = Math.floor(Math.random() * 10) + 1;
        return {
            question: `${table} × ${multiplier}`,
            answer: table * multiplier,
            operator: '×'
        };
    }

    /**
     * Génère une addition
     * @returns {Object}
     */
    generateAddition() {
        const { a, b } = this.getTwoNumbers();
        return {
            question: `${a} + ${b}`,
            answer: a + b,
            operator: '+'
        };
    }

    /**
     * Génère une soustraction
     * @returns {Object}
     */
    generateSubtraction() {
        let { a, b } = this.getTwoNumbers();

        // Si résultats négatifs non autorisés, s'assurer que a >= b
        if (!this.config.allowNegatives && a < b) {
            [a, b] = [b, a];
        }

        return {
            question: `${a} − ${b}`,
            answer: a - b,
            operator: '−'
        };
    }

    /**
     * Génère une division (résultats entiers uniquement)
     * @returns {Object}
     */
    generateDivision() {
        const tables = this.config.tables || [1, 2, 3, 4, 5];
        // Le diviseur vient des tables sélectionnées
        const divisor = tables[Math.floor(Math.random() * tables.length)];
        // Le quotient est entre 1 et 10
        const quotient = Math.floor(Math.random() * 10) + 1;
        // Le dividende est calculé pour garantir un résultat entier
        const dividend = divisor * quotient;

        return {
            question: `${dividend} ÷ ${divisor}`,
            answer: quotient,
            operator: '÷'
        };
    }

    /**
     * Génère une opération mixte (une des opérations au hasard)
     * @returns {Object}
     */
    generateCombined() {
        // Choisir une opération au hasard parmi celles disponibles
        const operations = ['addition', 'subtraction'];

        // Ajouter multiplication si des tables sont sélectionnées
        if (this.config.tables && this.config.tables.length > 0) {
            operations.push('multiplication');
            operations.push('division');
        }

        const randomOp = operations[Math.floor(Math.random() * operations.length)];

        switch (randomOp) {
            case 'multiplication':
                return this.generateMultiplication();
            case 'addition':
                return this.generateAddition();
            case 'subtraction':
                return this.generateSubtraction();
            case 'division':
                return this.generateDivision();
            default:
                return this.generateAddition();
        }
    }

    /**
     * Génère deux nombres selon la configuration du nombre de chiffres
     * @returns {Object} - { a: number, b: number }
     */
    getTwoNumbers() {
        const digitCount = this.config.digitCount || 1;

        if (digitCount === 1) {
            // Deux nombres entre 1 et 9
            return {
                a: Math.floor(Math.random() * 9) + 1,
                b: Math.floor(Math.random() * 9) + 1
            };
        } else {
            // Mode 2 chiffres : mélange autorisé, au moins un nombre 10-99
            // On génère un nombre à 2 chiffres et un nombre aléatoire (1-99)
            const twoDigit = Math.floor(Math.random() * 90) + 10; // 10-99
            const anyNumber = Math.floor(Math.random() * 99) + 1; // 1-99

            // Mélanger l'ordre aléatoirement
            if (Math.random() > 0.5) {
                return { a: twoDigit, b: anyNumber };
            } else {
                return { a: anyNumber, b: twoDigit };
            }
        }
    }

    /**
     * Génère un nombre aléatoire selon la configuration
     * @returns {number}
     */
    getRandomNumber() {
        const digitCount = this.config.digitCount || 1;
        if (digitCount === 1) {
            return Math.floor(Math.random() * 9) + 1;
        }
        // Pour 2 chiffres: mélange autorisé (1-99)
        return Math.floor(Math.random() * 99) + 1;
    }
}
