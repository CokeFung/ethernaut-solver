import subprocess

def main():
    
    """ Get contracts and testing scripts """
    contractList = run("ls ./contracts/")
    testList = run("ls ./test/")

    """ Create README for each levels (if not exist) """
    print("Creating README...")
    readme_template = "./test/example-vuln/README.md"
    readme_content = open(readme_template).read()
    for name in contractList:
        createREADME(readme_content, name)

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

def createREADME(readme_content, name):
    path = "./test/%s/" % name
    files = run("ls " + path)
    if not "README.md" in files:
        readme_content = readme_content.replace("example-vuln", name)
        new_readme = open(path + "README.md", "w")
        new_readme.write(readme_content)

main()
