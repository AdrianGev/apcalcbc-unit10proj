let QUESTION_BANK = {};
let questionsLoaded = false;

async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        QUESTION_BANK = await response.json();
        questionsLoaded = true;
        return true;
    } catch (error) {
        QUESTION_BANK = {
            sequences: [
                {
                    prompt: "Find \\(\\lim_{n \\to \\infty} \\frac{3n^2 + 2n}{n^2 - 5}\\)",
                    choices: ["\\(3\\)", "\\(0\\)", "\\(\\infty\\)", "Does not exist"],
                    correct: 0,
                    explanation: "Divide numerator and denominator by \\(n^2\\). The limit becomes \\(\\frac{3 + 2/n}{1 - 5/n^2} = \\frac{3}{1} = 3\\)."
                },
        {
            prompt: "Determine if the sequence \\(a_n = \\frac{(-1)^n}{n}\\) converges or diverges.",
            choices: ["Converges to 0", "Converges to 1", "Diverges", "Converges to -1"],
            correct: 0,
            explanation: "As \\(n \\to \\infty\\), \\(\\frac{1}{n} \\to 0\\). The alternating sign doesn't affect convergence to 0."
        },
        {
            prompt: "Find \\(\\lim_{n \\to \\infty} \\frac{5^n}{n!}\\)",
            choices: ["\\(0\\)", "\\(5\\)", "\\(\\infty\\)", "\\(1\\)"],
            correct: 0,
            explanation: "Factorial grows much faster than exponential. By ratio test or direct analysis, this limit is 0."
        },
        {
            prompt: "What is \\(\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n\\)?",
            choices: ["\\(e\\)", "\\(1\\)", "\\(\\infty\\)", "\\(0\\)"],
            correct: 0,
            explanation: "This is the definition of \\(e\\). The limit equals \\(e \\approx 2.718\\)."
        },
        {
            prompt: "Does \\(a_n = \\frac{n^2}{2^n}\\) converge?",
            choices: ["Yes, to 0", "Yes, to 1", "No, diverges", "Yes, to \\(\\infty\\)"],
            correct: 0,
            explanation: "Exponential in denominator dominates polynomial. The sequence converges to 0."
        }
    ],
    geometric: [
        {
            prompt: "Find the sum of \\(\\sum_{n=0}^{\\infty} \\frac{1}{3^n}\\)",
            choices: ["\\(\\frac{3}{2}\\)", "\\(3\\)", "\\(\\frac{1}{2}\\)", "Diverges"],
            correct: 0,
            explanation: "Geometric series with \\(a = 1\\) and \\(r = \\frac{1}{3}\\). Sum = \\(\\frac{a}{1-r} = \\frac{1}{1-1/3} = \\frac{3}{2}\\)."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\left(\\frac{2}{3}\\right)^n\\) converge?",
            choices: ["Yes, sum is 2", "Yes, sum is 3", "No, diverges", "Yes, sum is 1"],
            correct: 0,
            explanation: "Geometric with \\(r = \\frac{2}{3} < 1\\). Sum = \\(\\frac{2/3}{1-2/3} = \\frac{2/3}{1/3} = 2\\)."
        },
        {
            prompt: "What is \\(\\sum_{n=0}^{\\infty} 5 \\cdot \\left(\\frac{1}{2}\\right)^n\\)?",
            choices: ["\\(10\\)", "\\(5\\)", "\\(\\frac{5}{2}\\)", "Diverges"],
            correct: 0,
            explanation: "Geometric with \\(a = 5\\) and \\(r = \\frac{1}{2}\\). Sum = \\(\\frac{5}{1-1/2} = 10\\)."
        },
        {
            prompt: "For what values of \\(x\\) does \\(\\sum_{n=0}^{\\infty} x^n\\) converge?",
            choices: ["\\(|x| < 1\\)", "\\(|x| > 1\\)", "\\(x > 0\\)", "All \\(x\\)"],
            correct: 0,
            explanation: "Geometric series converges when \\(|r| < 1\\). Here \\(r = x\\), so \\(|x| < 1\\)."
        },
        {
            prompt: "Find \\(\\sum_{n=1}^{\\infty} \\frac{4}{5^n}\\)",
            choices: ["\\(1\\)", "\\(\\frac{4}{5}\\)", "\\(\\frac{5}{4}\\)", "\\(4\\)"],
            correct: 0,
            explanation: "Geometric with \\(a = \\frac{4}{5}\\) and \\(r = \\frac{1}{5}\\). Sum = \\(\\frac{4/5}{1-1/5} = \\frac{4/5}{4/5} = 1\\)."
        }
    ],
    pseries: [
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{1}{n^2}\\) converge or diverge?",
            choices: ["Converges", "Diverges", "Conditionally converges", "Cannot determine"],
            correct: 0,
            explanation: "This is a p-series with \\(p = 2 > 1\\), so it converges."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{1}{n}\\) converge or diverge?",
            choices: ["Diverges", "Converges", "Conditionally converges", "Cannot determine"],
            correct: 0,
            explanation: "This is the harmonic series (\\(p = 1\\)). It diverges."
        },
        {
            prompt: "For which values of \\(p\\) does \\(\\sum_{n=1}^{\\infty} \\frac{1}{n^p}\\) converge?",
            choices: ["\\(p > 1\\)", "\\(p < 1\\)", "\\(p \\geq 1\\)", "All \\(p\\)"],
            correct: 0,
            explanation: "p-series converges if and only if \\(p > 1\\)."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{1}{\\sqrt{n}}\\) converge?",
            choices: ["Diverges", "Converges", "Conditionally converges", "Cannot determine"],
            correct: 0,
            explanation: "This is \\(\\sum \\frac{1}{n^{1/2}}\\), a p-series with \\(p = \\frac{1}{2} < 1\\). It diverges."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{1}{n^3}\\) converge?",
            choices: ["Converges", "Diverges", "Conditionally converges", "Cannot determine"],
            correct: 0,
            explanation: "p-series with \\(p = 3 > 1\\), so it converges."
        }
    ],
    integral: [
        {
            prompt: "Use the Integral Test on \\(\\sum_{n=1}^{\\infty} \\frac{1}{n^2 + 1}\\). Does it converge?",
            choices: ["Converges", "Diverges", "Test inconclusive", "Cannot apply test"],
            correct: 0,
            explanation: "\\(\\int_1^{\\infty} \\frac{1}{x^2+1} dx = \\arctan(x)|_1^{\\infty}\\) converges, so the series converges."
        },
        {
            prompt: "Does \\(\\sum_{n=2}^{\\infty} \\frac{1}{n \\ln n}\\) converge by the Integral Test?",
            choices: ["Diverges", "Converges", "Test inconclusive", "Cannot apply test"],
            correct: 0,
            explanation: "\\(\\int_2^{\\infty} \\frac{1}{x \\ln x} dx = \\ln(\\ln x)|_2^{\\infty}\\) diverges, so the series diverges."
        },
        {
            prompt: "Apply Integral Test to \\(\\sum_{n=1}^{\\infty} \\frac{\\ln n}{n^2}\\)",
            choices: ["Converges", "Diverges", "Test inconclusive", "Cannot apply test"],
            correct: 0,
            explanation: "Using integration by parts, \\(\\int_1^{\\infty} \\frac{\\ln x}{x^2} dx\\) converges, so the series converges."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} ne^{-n}\\) converge?",
            choices: ["Converges", "Diverges", "Test inconclusive", "Cannot apply test"],
            correct: 0,
            explanation: "\\(\\int_1^{\\infty} xe^{-x} dx\\) converges (use integration by parts), so the series converges."
        },
        {
            prompt: "Use Integral Test on \\(\\sum_{n=1}^{\\infty} \\frac{1}{n(\\ln n)^2}\\) for \\(n \\geq 2\\)",
            choices: ["Converges", "Diverges", "Test inconclusive", "Cannot apply test"],
            correct: 0,
            explanation: "\\(\\int_2^{\\infty} \\frac{1}{x(\\ln x)^2} dx = -\\frac{1}{\\ln x}|_2^{\\infty}\\) converges, so the series converges."
        }
    ],
    comparison: [
        {
            prompt: "Compare \\(\\sum_{n=1}^{\\infty} \\frac{1}{2^n + n}\\) to a known series.",
            choices: ["Converges (compare to \\(\\sum \\frac{1}{2^n}\\))", "Diverges", "Test inconclusive", "Cannot compare"],
            correct: 0,
            explanation: "\\(\\frac{1}{2^n + n} < \\frac{1}{2^n}\\) and \\(\\sum \\frac{1}{2^n}\\) converges (geometric), so by comparison test, the series converges."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{n}{n^3 + 1}\\) converge?",
            choices: ["Converges (compare to \\(\\sum \\frac{1}{n^2}\\))", "Diverges", "Test inconclusive", "Cannot compare"],
            correct: 0,
            explanation: "For large \\(n\\), \\(\\frac{n}{n^3+1} \\approx \\frac{1}{n^2}\\). By limit comparison test with \\(\\sum \\frac{1}{n^2}\\), it converges."
        },
        {
            prompt: "Compare \\(\\sum_{n=1}^{\\infty} \\frac{\\sqrt{n}}{n^2 + 1}\\) to determine convergence.",
            choices: ["Converges (compare to \\(\\sum \\frac{1}{n^{3/2}}\\))", "Diverges", "Test inconclusive", "Cannot compare"],
            correct: 0,
            explanation: "\\(\\frac{\\sqrt{n}}{n^2+1} \\approx \\frac{1}{n^{3/2}}\\) for large \\(n\\). Since \\(p = \\frac{3}{2} > 1\\), it converges."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{2n + 3}{n^2}\\) converge?",
            choices: ["Diverges (compare to \\(\\sum \\frac{1}{n}\\))", "Converges", "Test inconclusive", "Cannot compare"],
            correct: 0,
            explanation: "\\(\\frac{2n+3}{n^2} \\approx \\frac{2}{n}\\) for large \\(n\\). By limit comparison with harmonic series, it diverges."
        },
        {
            prompt: "Use comparison test on \\(\\sum_{n=1}^{\\infty} \\frac{1}{n!}\\)",
            choices: ["Converges", "Diverges", "Test inconclusive", "Cannot compare"],
            correct: 0,
            explanation: "\\(\\frac{1}{n!} < \\frac{1}{2^n}\\) for \\(n \\geq 4\\). Since geometric series converges, so does this series."
        }
    ],
    ast: [
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n}\\) converge?",
            choices: ["Converges conditionally", "Converges absolutely", "Diverges", "Cannot determine"],
            correct: 0,
            explanation: "By AST: \\(\\frac{1}{n}\\) is decreasing and \\(\\lim \\frac{1}{n} = 0\\), so it converges. But \\(\\sum \\frac{1}{n}\\) diverges, so convergence is conditional."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n^2}\\) converge absolutely?",
            choices: ["Yes, converges absolutely", "Converges conditionally", "Diverges", "Cannot determine"],
            correct: 0,
            explanation: "\\(\\sum \\frac{1}{n^2}\\) converges (p-series, \\(p=2\\)), so the alternating series converges absolutely."
        },
        {
            prompt: "Apply AST to \\(\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{\\sqrt{n}}\\)",
            choices: ["Converges conditionally", "Converges absolutely", "Diverges", "Test fails"],
            correct: 0,
            explanation: "AST conditions met: decreasing, limit is 0. But \\(\\sum \\frac{1}{\\sqrt{n}}\\) diverges (\\(p = 1/2\\)), so conditional convergence."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{(-1)^n n}{n^2 + 1}\\) converge?",
            choices: ["Converges conditionally", "Converges absolutely", "Diverges", "Cannot determine"],
            correct: 0,
            explanation: "\\(\\frac{n}{n^2+1} \\to 0\\) and is eventually decreasing. AST applies, series converges. \\(\\sum \\frac{n}{n^2+1}\\) diverges, so conditional."
        },
        {
            prompt: "For \\(\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{2n-1}\\), what is the error bound for \\(S_5\\)?",
            choices: ["\\(\\frac{1}{11}\\)", "\\(\\frac{1}{9}\\)", "\\(\\frac{1}{10}\\)", "\\(\\frac{1}{12}\\)"],
            correct: 0,
            explanation: "Error bound is \\(|a_{n+1}|\\). For \\(n=5\\), next term is \\(a_6 = \\frac{1}{2(6)-1} = \\frac{1}{11}\\)."
        }
    ],
    ratio: [
        {
            prompt: "Apply Ratio Test to \\(\\sum_{n=1}^{\\infty} \\frac{n!}{n^n}\\)",
            choices: ["Converges", "Diverges", "Test inconclusive", "Cannot apply"],
            correct: 0,
            explanation: "\\(L = \\lim \\frac{(n+1)!/(n+1)^{n+1}}{n!/n^n} = \\lim \\frac{n^n}{(n+1)^n} = \\frac{1}{e} < 1\\). Series converges."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{2^n}{n!}\\) converge by Ratio Test?",
            choices: ["Converges", "Diverges", "Test inconclusive", "Cannot apply"],
            correct: 0,
            explanation: "\\(L = \\lim \\frac{2^{n+1}/(n+1)!}{2^n/n!} = \\lim \\frac{2}{n+1} = 0 < 1\\). Series converges."
        },
        {
            prompt: "Apply Ratio Test to \\(\\sum_{n=1}^{\\infty} \\frac{n^n}{n!}\\)",
            choices: ["Diverges", "Converges", "Test inconclusive", "Cannot apply"],
            correct: 0,
            explanation: "\\(L = \\lim \\frac{(n+1)^{n+1}/(n+1)!}{n^n/n!} = \\lim \\frac{(n+1)^n}{n^n} = e > 1\\). Series diverges."
        },
        {
            prompt: "Does \\(\\sum_{n=1}^{\\infty} \\frac{3^n}{n^3}\\) converge?",
            choices: ["Diverges", "Converges", "Test inconclusive", "Cannot apply"],
            correct: 0,
            explanation: "\\(L = \\lim \\frac{3^{n+1}/(n+1)^3}{3^n/n^3} = 3 \\lim \\frac{n^3}{(n+1)^3} = 3 > 1\\). Series diverges."
        },
        {
            prompt: "Use Ratio Test on \\(\\sum_{n=1}^{\\infty} \\frac{5^n}{(2n)!}\\)",
            choices: ["Converges", "Diverges", "Test inconclusive", "Cannot apply"],
            correct: 0,
            explanation: "\\(L = \\lim \\frac{5^{n+1}/(2n+2)!}{5^n/(2n)!} = \\lim \\frac{5}{(2n+2)(2n+1)} = 0 < 1\\). Converges."
        }
    ],
    power: [
        {
            prompt: "Find the radius of convergence of \\(\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}\\)",
            choices: ["\\(R = \\infty\\)", "\\(R = 1\\)", "\\(R = 0\\)", "\\(R = e\\)"],
            correct: 0,
            explanation: "Using ratio test: \\(L = \\lim \\frac{|x|}{n+1} = 0\\) for all \\(x\\). So \\(R = \\infty\\)."
        },
        {
            prompt: "What is the radius of convergence of \\(\\sum_{n=1}^{\\infty} \\frac{x^n}{n}\\)?",
            choices: ["\\(R = 1\\)", "\\(R = \\infty\\)", "\\(R = 0\\)", "\\(R = e\\)"],
            correct: 0,
            explanation: "Using ratio test: \\(L = |x| \\lim \\frac{n}{n+1} = |x|\\). Converges when \\(|x| < 1\\), so \\(R = 1\\)."
        },
        {
            prompt: "Find \\(R\\) for \\(\\sum_{n=0}^{\\infty} n! x^n\\)",
            choices: ["\\(R = 0\\)", "\\(R = 1\\)", "\\(R = \\infty\\)", "\\(R = e\\)"],
            correct: 0,
            explanation: "\\(L = |x| \\lim (n+1) = \\infty\\) for any \\(x \\neq 0\\). Series only converges at \\(x = 0\\), so \\(R = 0\\)."
        },
        {
            prompt: "What is the radius of convergence of \\(\\sum_{n=1}^{\\infty} \\frac{(x-2)^n}{3^n}\\)?",
            choices: ["\\(R = 3\\)", "\\(R = 2\\)", "\\(R = 1\\)", "\\(R = \\infty\\)"],
            correct: 0,
            explanation: "This is geometric in \\((x-2)/3\\). Converges when \\(|x-2|/3 < 1\\), so \\(|x-2| < 3\\) and \\(R = 3\\)."
        },
        {
            prompt: "Find the radius of convergence of \\(\\sum_{n=1}^{\\infty} \\frac{x^n}{n^2}\\)",
            choices: ["\\(R = 1\\)", "\\(R = 2\\)", "\\(R = \\infty\\)", "\\(R = 0\\)"],
            correct: 0,
            explanation: "Ratio test: \\(L = |x| \\lim \\frac{n^2}{(n+1)^2} = |x|\\). Converges when \\(|x| < 1\\), so \\(R = 1\\)."
        }
    ],
    interval: [
        {
            prompt: "Find the interval of convergence of \\(\\sum_{n=1}^{\\infty} \\frac{x^n}{n}\\)",
            choices: ["\\([-1, 1)\\)", "\\((-1, 1)\\)", "\\([-1, 1]\\)", "\\((-1, 1]\\)"],
            correct: 0,
            explanation: "\\(R = 1\\). At \\(x = 1\\): \\(\\sum \\frac{1}{n}\\) diverges. At \\(x = -1\\): \\(\\sum \\frac{(-1)^n}{n}\\) converges (AST). Interval: \\([-1, 1)\\)."
        },
        {
            prompt: "What is the interval of convergence of \\(\\sum_{n=1}^{\\infty} \\frac{(x-3)^n}{n^2}\\)?",
            choices: ["\\([2, 4]\\)", "\\((2, 4)\\)", "\\([2, 4)\\)", "\\((2, 4]\\)"],
            correct: 0,
            explanation: "\\(R = 1\\), centered at 3. At \\(x = 2\\): \\(\\sum \\frac{(-1)^n}{n^2}\\) converges. At \\(x = 4\\): \\(\\sum \\frac{1}{n^2}\\) converges. Interval: \\([2, 4]\\)."
        },
        {
            prompt: "Find the interval of convergence of \\(\\sum_{n=0}^{\\infty} \\frac{x^n}{2^n}\\)",
            choices: ["\\((-2, 2)\\)", "\\([-2, 2]\\)", "\\([-2, 2)\\)", "\\((-2, 2]\\)"],
            correct: 0,
            explanation: "Geometric series with \\(r = x/2\\). Converges when \\(|x/2| < 1\\), so \\(|x| < 2\\). Diverges at endpoints. Interval: \\((-2, 2)\\)."
        },
        {
            prompt: "What is the interval of convergence of \\(\\sum_{n=1}^{\\infty} \\frac{(x+1)^n}{n \\cdot 3^n}\\)?",
            choices: ["\\([-4, 2]\\)", "\\((-4, 2)\\)", "\\([-4, 2)\\)", "\\((-4, 2]\\)"],
            correct: 0,
            explanation: "\\(R = 3\\), centered at \\(-1\\). At \\(x = -4\\): \\(\\sum \\frac{(-1)^n}{n}\\) converges. At \\(x = 2\\): \\(\\sum \\frac{1}{n}\\) diverges. Interval: \\([-4, 2)\\)."
        },
        {
            prompt: "Find the interval of convergence of \\(\\sum_{n=0}^{\\infty} n! x^n\\)",
            choices: ["\\(\\{0\\}\\)", "\\((-1, 1)\\)", "\\(\\mathbb{R}\\)", "\\([-1, 1]\\)"],
            correct: 0,
            explanation: "\\(R = 0\\). Series only converges at \\(x = 0\\). Interval: \\(\\{0\\}\\)."
        }
    ],
    taylor: [
        {
            prompt: "Find the 2nd degree Taylor polynomial for \\(f(x) = e^x\\) at \\(x = 0\\)",
            choices: ["\\(1 + x + \\frac{x^2}{2}\\)", "\\(1 + x + x^2\\)", "\\(x + \\frac{x^2}{2}\\)", "\\(1 + 2x + x^2\\)"],
            correct: 0,
            explanation: "\\(f(0) = 1\\), \\(f'(0) = 1\\), \\(f''(0) = 1\\). \\(P_2(x) = 1 + x + \\frac{x^2}{2}\\)."
        },
        {
            prompt: "What is the 3rd degree Taylor polynomial for \\(\\sin x\\) at \\(x = 0\\)?",
            choices: ["\\(x - \\frac{x^3}{6}\\)", "\\(x - \\frac{x^3}{3}\\)", "\\(x + \\frac{x^3}{6}\\)", "\\(1 - \\frac{x^2}{2}\\)"],
            correct: 0,
            explanation: "\\(\\sin(0) = 0\\), \\(\\cos(0) = 1\\), \\(-\\sin(0) = 0\\), \\(-\\cos(0) = -1\\). \\(P_3(x) = x - \\frac{x^3}{6}\\)."
        },
        {
            prompt: "Find the 2nd degree Taylor polynomial for \\(\\ln(1+x)\\) at \\(x = 0\\)",
            choices: ["\\(x - \\frac{x^2}{2}\\)", "\\(x + \\frac{x^2}{2}\\)", "\\(1 + x - \\frac{x^2}{2}\\)", "\\(x - x^2\\)"],
            correct: 0,
            explanation: "\\(f(0) = 0\\), \\(f'(0) = 1\\), \\(f''(0) = -1\\). \\(P_2(x) = x - \\frac{x^2}{2}\\)."
        },
        {
            prompt: "What is the 2nd degree Taylor polynomial for \\(\\cos x\\) at \\(x = 0\\)?",
            choices: ["\\(1 - \\frac{x^2}{2}\\)", "\\(1 + \\frac{x^2}{2}\\)", "\\(1 - x^2\\)", "\\(x - \\frac{x^2}{2}\\)"],
            correct: 0,
            explanation: "\\(\\cos(0) = 1\\), \\(-\\sin(0) = 0\\), \\(-\\cos(0) = -1\\). \\(P_2(x) = 1 - \\frac{x^2}{2}\\)."
        },
        {
            prompt: "Find the 3rd degree Taylor polynomial for \\(f(x) = \\frac{1}{1-x}\\) at \\(x = 0\\)",
            choices: ["\\(1 + x + x^2 + x^3\\)", "\\(1 + x + \\frac{x^2}{2} + \\frac{x^3}{6}\\)", "\\(x + x^2 + x^3\\)", "\\(1 - x + x^2 - x^3\\)"],
            correct: 0,
            explanation: "This is the geometric series. \\(P_3(x) = 1 + x + x^2 + x^3\\)."
        }
    ],
    maclaurin: [
        {
            prompt: "What is the Maclaurin series for \\(e^x\\)?",
            choices: ["\\(\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{x^n}{n}\\)", "\\(\\sum_{n=0}^{\\infty} x^n\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{(-1)^n x^n}{n!}\\)"],
            correct: 0,
            explanation: "The Maclaurin series for \\(e^x\\) is \\(\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}\\)."
        },
        {
            prompt: "What is the Maclaurin series for \\(\\sin x\\)?",
            choices: ["\\(\\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{x^{2n+1}}{(2n+1)!}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}\\)"],
            correct: 0,
            explanation: "\\(\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}\\)."
        },
        {
            prompt: "What is the Maclaurin series for \\(\\cos x\\)?",
            choices: ["\\(\\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{x^{2n}}{(2n)!}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}\\)"],
            correct: 0,
            explanation: "\\(\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}\\)."
        },
        {
            prompt: "What is the Maclaurin series for \\(\\frac{1}{1-x}\\)?",
            choices: ["\\(\\sum_{n=0}^{\\infty} x^n\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{x^n}{n}\\)", "\\(\\sum_{n=0}^{\\infty} (-1)^n x^n\\)"],
            correct: 0,
            explanation: "This is the geometric series: \\(\\frac{1}{1-x} = \\sum_{n=0}^{\\infty} x^n\\) for \\(|x| < 1\\)."
        },
        {
            prompt: "What is the Maclaurin series for \\(\\ln(1+x)\\)?",
            choices: ["\\(\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1} x^n}{n}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{x^n}{n}\\)", "\\(\\sum_{n=1}^{\\infty} \\frac{x^n}{n}\\)", "\\(\\sum_{n=0}^{\\infty} \\frac{(-1)^n x^n}{n!}\\)"],
            correct: 0,
            explanation: "\\(\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1} x^n}{n}\\)."
        }
    ],
    lagrange: [
        {
            prompt: "For \\(f(x) = e^x\\) and \\(P_3(x)\\) at \\(x=0\\), find the Lagrange error bound at \\(x = 0.5\\)",
            choices: ["\\(\\frac{e^{0.5}}{384}\\)", "\\(\\frac{e}{384}\\)", "\\(\\frac{1}{384}\\)", "\\(\\frac{e^{0.5}}{24}\\)"],
            correct: 0,
            explanation: "\\(|R_3(0.5)| \\leq \\frac{M|x-a|^4}{4!}\\) where \\(M = e^{0.5}\\). \\(|R_3| \\leq \\frac{e^{0.5}(0.5)^4}{24} = \\frac{e^{0.5}}{384}\\)."
        },
        {
            prompt: "For \\(\\sin x\\) with \\(P_5(x)\\) at \\(x=0\\), what is the max error on \\([0, 0.1]\\)?",
            choices: ["\\(\\frac{(0.1)^7}{7!}\\)", "\\(\\frac{(0.1)^6}{6!}\\)", "\\(\\frac{(0.1)^5}{5!}\\)", "\\(\\frac{1}{7!}\\)"],
            correct: 0,
            explanation: "\\(|R_5(x)| \\leq \\frac{M|x|^6}{6!}\\) where \\(M = 1\\) (max of \\(|\\sin^{(6)}|\\) or \\(|\\cos|\\)). At \\(x = 0.1\\): \\(\\frac{(0.1)^6}{720}\\). But next derivative is 7th, so \\(\\frac{(0.1)^7}{5040}\\)."
        },
        {
            prompt: "If \\(|f^{(4)}(x)| \\leq 2\\) on \\([0,1]\\), what is the error bound for \\(P_3(x)\\) at \\(x=1\\)?",
            choices: ["\\(\\frac{1}{12}\\)", "\\(\\frac{1}{24}\\)", "\\(\\frac{2}{24}\\)", "\\(\\frac{1}{6}\\)"],
            correct: 0,
            explanation: "\\(|R_3(1)| \\leq \\frac{2 \\cdot 1^4}{4!} = \\frac{2}{24} = \\frac{1}{12}\\)."
        },
        {
            prompt: "For \\(\\cos x\\) with \\(P_4(x)\\) at \\(x=0\\), estimate the error at \\(x = 0.2\\)",
            choices: ["\\(\\frac{(0.2)^6}{6!}\\)", "\\(\\frac{(0.2)^5}{5!}\\)", "\\(\\frac{(0.2)^4}{4!}\\)", "\\(\\frac{(0.2)^6}{5!}\\)"],
            correct: 0,
            explanation: "Next non-zero term is \\(x^6\\). \\(|R_4(0.2)| \\leq \\frac{1 \\cdot (0.2)^6}{6!} = \\frac{(0.2)^6}{720}\\)."
        },
        {
            prompt: "Using \\(P_2(x)\\) for \\(\\ln(1+x)\\) at \\(x=0\\), bound the error at \\(x = 0.5\\)",
            choices: ["\\(\\frac{1}{24}\\)", "\\(\\frac{1}{12}\\)", "\\(\\frac{1}{48}\\)", "\\(\\frac{1}{6}\\)"],
            correct: 0,
            explanation: "\\(f'''(x) = \\frac{2}{(1+x)^3}\\), max on \\([0, 0.5]\\) is 2. \\(|R_2(0.5)| \\leq \\frac{2(0.5)^3}{6} = \\frac{0.25}{6} = \\frac{1}{24}\\)."
        }
    ]
        };
        questionsLoaded = true;
        return false;
    }
}

class QuestionManager {
    constructor() {
        this.currentTopic = 'sequences';
        this.pinnedTopic = null;
        this.topicQueue = ['sequences', 'geometric'];
        this.queueIndex = 0;
        this.questionsAnswered = 0;
        this.questionsSinceRotation = 0;
        this.stats = {};
        
        Object.keys(TOPIC_DATA).forEach(topic => {
            this.stats[topic] = {
                attempted: 0,
                correct: 0,
                coinsEarned: 0
            };
        });
        
        this.currentQuestion = null;
        this.isRetry = false;
    }
    
    updateAvailableTopics(currentWave) {
        this.topicQueue = [];
        Object.keys(TOPIC_DATA).forEach(topic => {
            if (TOPIC_DATA[topic].unlockWave <= currentWave) {
                this.topicQueue.push(topic);
            }
        });
        
        if (!this.topicQueue.includes(this.currentTopic)) {
            this.currentTopic = this.topicQueue[0];
        }
    }
    
    getNextQuestion() {
        const topic = this.pinnedTopic || this.currentTopic;
        const questions = QUESTION_BANK[topic];
        
        if (!questions || questions.length === 0) {
            return null;
        }
        
        if (questions.length === 1) {
            this.currentQuestion = {
                ...questions[0],
                topic: topic
            };
            return this.currentQuestion;
        }
        
        let randomIndex;
        let attempts = 0;
        do {
            randomIndex = Math.floor(Math.random() * questions.length);
            attempts++;
            if (attempts > 50) break;
        } while (this.currentQuestion && 
                 questions[randomIndex].prompt === this.currentQuestion.prompt &&
                 this.currentQuestion.topic === topic);
        
        this.currentQuestion = {
            ...questions[randomIndex],
            topic: topic
        };
        
        return this.currentQuestion;
    }
    
    answerQuestion(choiceIndex, isCorrect) {
        const topic = this.currentQuestion.topic;
        this.stats[topic].attempted++;
        
        let coinsEarned = 0;
        if (isCorrect) {
            this.stats[topic].correct++;
            coinsEarned = this.isRetry ? 
                Math.floor(TOPIC_DATA[topic].coins / 2) : 
                TOPIC_DATA[topic].coins;
            this.stats[topic].coinsEarned += coinsEarned;
            
            this.isRetry = false;
            this.questionsAnswered++;
            this.questionsSinceRotation++;
            
            if (this.questionsSinceRotation >= 3 && !this.pinnedTopic) {
                this.rotateTopic();
            }
        }
        
        return {
            correct: isCorrect,
            coins: coinsEarned,
            explanation: this.currentQuestion.explanation,
            userAnswer: choiceIndex
        };
    }
    
    retry() {
        this.isRetry = true;
        return this.getNextQuestion();
    }
    
    skipQuestion() {
        this.isRetry = false;
        return this.getNextQuestion();
    }
    
    rotateTopic() {
        if (this.pinnedTopic) return;
        
        this.questionsSinceRotation = 0;
        this.queueIndex = (this.queueIndex + 1) % this.topicQueue.length;
        this.currentTopic = this.topicQueue[this.queueIndex];
    }
    
    skipTopic() {
        if (this.pinnedTopic) return;
        
        this.rotateTopic();
        return this.getNextQuestion();
    }
    
    togglePin() {
        if (this.pinnedTopic) {
            this.pinnedTopic = null;
        } else {
            this.pinnedTopic = this.currentTopic;
        }
    }
    
    startFullReview() {
        this.pinnedTopic = null;
        this.queueIndex = 0;
        this.currentTopic = this.topicQueue[0];
        this.questionsSinceRotation = 0;
    }
    
    getTopicStats() {
        return this.stats;
    }
    
    getAccuracy(topic) {
        const stats = this.stats[topic];
        if (stats.attempted === 0) return 0;
        return (stats.correct / stats.attempted) * 100;
    }
    
    getOverallAccuracy() {
        let totalAttempted = 0;
        let totalCorrect = 0;
        
        Object.values(this.stats).forEach(stat => {
            totalAttempted += stat.attempted;
            totalCorrect += stat.correct;
        });
        
        if (totalAttempted === 0) return 100;
        return (totalCorrect / totalAttempted) * 100;
    }
}