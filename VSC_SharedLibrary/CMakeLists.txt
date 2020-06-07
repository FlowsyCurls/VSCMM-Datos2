cmake_minimum_required(VERSION 3.16)
project(VSC_SharedLibrary)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS -pthread)

add_library(VSC_SharedLibrary SHARED
        src/library
        src/GBCollector
        src/HashTable
        src/LinkedList
        src/Set
        src/VSPointer
        src/Set
        src/json.hpp
        )

find_package(Threads REQUIRED)
target_link_libraries( VSC_SharedLibrary Threads::Threads)