"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "Basics": [
        {
            "input": ["acb", "bd", "zwa"],
            "answer": "zwacbd"
        },
        {
            "input": ["klm", "kadl", "lsm"],
            "answer": "kadlsm"
        },
        {
            "input": ["a", "b", "c"],
            "answer": "abc"
        },
        {
            "input": ["aazzss"],
            "answer": "azs"
        },
        {
            "input": ["dfg", "frt", "tyg"],
            "answer": "dfrtyg"
        },

        {
            "input": ["hello", "low", "lino", "itttnosw"],
            "answer": "helitnosw"
        },

        {
            "input": ["my", "name", "myke"],
            "answer": "namyke"
        },

        {
            "input": ["xxxyyz", "yyww", "wwtt", "ttzz"],
            "answer": "xywtz"
        },

        {
            "input": ["axton", "bxton"],
            "answer": "abxton"
        },
        {
            "input": ["is", "not", "abc", "nots", "iabcn"],
            "answer": "iabcnots"
        },
        {
            "input": ["qwerty", "asdfg", "zxcvb", "yagz"],
            "answer": "qwertyasdfgzxcvb"
        }

    ],
    "Extra": [
        {
            "input": ["bad", "dc", "zwb"],
            "answer": "zwbadc"
        },
        {
            "input": ["klm", "kbcl", "ljm"],
            "answer": "kbcljm"
        },
        {
            "input": ["b", "d", "a"],
            "answer": "abd"
        },
        {
            "input": ["bbzzjj"],
            "answer": "bzj"
        },
        {
            "input": ["cfg", "frt", "tyg"],
            "answer": "cfrtyg"
        },

        {
            "input": ["hello", "low", "lino", "itttnojw"],
            "answer": "helitnojw"
        },

        {
            "input": ["my", "nbme", "myke"],
            "answer": "nbmyke"
        },

        {
            "input": ["rrryyz", "yyww", "wwtt", "ttzz"],
            "answer": "rywtz"
        },

        {
            "input": ["bxton", "dxton"],
            "answer": "bdxton"
        },
        {
            "input": ["ij", "not", "bda", "notj", "ibdan"],
            "answer": "ibdanotj"
        },
        {
            "input": ["qwerty", "bjcfg", "zxavd", "ybgz"],
            "answer": "qwertybjcfgzxavd"
        }

    ]
}
