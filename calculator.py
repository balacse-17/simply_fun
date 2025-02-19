
try:
    import math
    def sq(a):
        return a**2
    def cube(b):
        return b**3
    def sq_root(a):
        return math.sqrt(a)
    def cube_root(b):
        return b**(1/3)
    def calcu():
        n=int(input("Enter your input:"))
        print("square of ",n,"is",sq(n))
        print("Cube of ",n,"is",cube(n))
        print("Square root of",n,"is",sq_root(n))
        print("Cube root of",n,"is",cube_root(n))
        x=input("Do you want to continue giving input(yes/no):")
        if x=="yes":
            calcu()
        else:
            print("Thank you")
    calcu()

except ValueError:
    print("negative values are not allowed")