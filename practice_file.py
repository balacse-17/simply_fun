import streamlit as st
st.write("CALCULATOR")
a=st.number_input("number-1")
b=st.number_input("number-2")


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
    st.button("add")
    st.button("sub")
    st.button("mul")
    st.button("div")

    