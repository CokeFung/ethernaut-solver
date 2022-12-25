import subprocess

def main():
    """ Get contracts and testing scripts """
    contractList = run("ls ./contracts/")
    testList = run("ls ./test/")

    """ Find diff of 2 lists """
    set_dif = set(contractList).symmetric_difference(set(testList))
    toCreateList = list(set_dif)
    print(toCreateList)

    """ Create testing scripts from diff list """
    print("Script:\n{")
    for d in toCreateList:
        run("mkdir ./test/%s" % d)
        run("cp ./test/example-vuln/example-vuln.challenge.js ./test/%s/%s.challenge.js" % (d, d))
        print('\t"%s": "yarn hardhat test test/%s/%s.challenge.js",' % (d,d,d))
    print("}\nDone!")

def run(command):
    output = subprocess.check_output(command, shell=True)
    return output.decode().strip("\n").split("\n")

main()
