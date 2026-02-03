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
                case 'fractions':
                    result = this.generateFraction();
                    break;
                case 'percentages':
                    result = this.generatePercentage();
                    break;
                case 'powers':
                    result = this.generatePower();
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
            operator: '×',
            table: table
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
            operator: '÷',
            table: divisor
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

    /**
     * Génère une question de fraction (résultat entier obligatoire)
     * Exemples: "1/2 de 20 = ?", "1/4 de 40 = ?"
     * @returns {Object}
     */
    generateFraction() {
        const fractions = [
            { num: 1, den: 2, symbol: '½', bases: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] },
            { num: 1, den: 3, symbol: '⅓', bases: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30] },
            { num: 1, den: 4, symbol: '¼', bases: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40] },
            { num: 1, den: 5, symbol: '⅕', bases: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50] },
            { num: 1, den: 10, symbol: '1/10', bases: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
            { num: 2, den: 3, symbol: '⅔', bases: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30] },
            { num: 3, den: 4, symbol: '¾', bases: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40] }
        ];

        const fraction = fractions[Math.floor(Math.random() * fractions.length)];
        const base = fraction.bases[Math.floor(Math.random() * fraction.bases.length)];
        const answer = (base * fraction.num) / fraction.den;

        return {
            question: `${fraction.symbol} de ${base}`,
            answer: answer,
            operator: 'frac'
        };
    }

    /**
     * Génère une question de pourcentage (résultat entier)
     * Exemples: "10% de 50", "25% de 80", "50% de 36"
     * @returns {Object}
     */
    generatePercentage() {
        const percentConfigs = [
            { percent: 10, bases: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] },
            { percent: 20, bases: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] },
            { percent: 25, bases: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48] },
            { percent: 50, bases: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] },
            { percent: 75, bases: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40] },
            { percent: 100, bases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25] }
        ];

        const config = percentConfigs[Math.floor(Math.random() * percentConfigs.length)];
        const base = config.bases[Math.floor(Math.random() * config.bases.length)];
        const answer = (base * config.percent) / 100;

        return {
            question: `${config.percent}% de ${base}`,
            answer: answer,
            operator: '%'
        };
    }

    /**
     * Génère une question de puissance
     * Exemples: "2³", "3²", "5²", "10²"
     * @returns {Object}
     */
    generatePower() {
        const configs = [
            { base: 2, exponents: [2, 3, 4, 5, 6] },    // 4, 8, 16, 32, 64
            { base: 3, exponents: [2, 3, 4] },          // 9, 27, 81
            { base: 4, exponents: [2, 3] },             // 16, 64
            { base: 5, exponents: [2, 3] },             // 25, 125
            { base: 6, exponents: [2] },                // 36
            { base: 7, exponents: [2] },                // 49
            { base: 8, exponents: [2] },                // 64
            { base: 9, exponents: [2] },                // 81
            { base: 10, exponents: [2, 3] },            // 100, 1000
            { base: 11, exponents: [2] },               // 121
            { base: 12, exponents: [2] }                // 144
        ];

        const config = configs[Math.floor(Math.random() * configs.length)];
        const exponent = config.exponents[Math.floor(Math.random() * config.exponents.length)];
        const answer = Math.pow(config.base, exponent);

        // Symboles d'exposants Unicode
        const exponentSymbols = {
            2: '²',
            3: '³',
            4: '⁴',
            5: '⁵',
            6: '⁶'
        };

        return {
            question: `${config.base}${exponentSymbols[exponent] || '^' + exponent}`,
            answer: answer,
            operator: '^'
        };
    }
}
