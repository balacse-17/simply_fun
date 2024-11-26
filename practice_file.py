import streamlit as st
ans=0

def add(a,b):
    return a+b

def sub(a,b):
    return a-b

def mul(a,b):
    return a*b

def div(a,b):
    return a/b

def exp(a,b):
    return a**b

def root(a):
    return a**0.5

def cubic_root(a):
    return a**(1/3)

st.header("CALCULATOR")
a=st.number_input("Number-1")
b=st.number_input("Number-2")


col1,col2,col3,col4,col5 = st.columns(5)

with col1:
    st.button("1")
    st.button("4")
    st.button("7")

with col2:
    st.button("2")
    st.button("5")
    st.button("8")
    st.button("0")

with col3:
    st.button("3")
    st.button("6")
    st.button("9")
    st.button("=")

with col4:
    if st.button("Add"):
        ans=add(a,b)
    if st.button("Sub"):
        ans=sub(a,b)
    if st.button("Mul"):
        ans=mul(a,b)
    if st.button("Div"):
        ans=div(a,b)

with col5:
    if st.button("Exponent"):
        ans=exp(a,b)
    if st.button("Square Root"):
        ans=root(a)
    if st.button("Cubic Root"):
        ans=cubic_root(a)

st.title(ans)