cmake_minimum_required(VERSION 3.15)
project(Datos_2___2_0)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_FLAGS -pthread)

add_executable( Datos_2___2_0 "src/mainVSPtr.cpp"
        "src/GBCollector"
        "src/HashTable"
        "src/LinkedList"
        "src/Set"
        "src/VSPointer"
        "src/Set.cpp"
        "src/json.hpp"
        )

find_package(Threads REQUIRED)
target_link_libraries( Datos_2___2_0 Threads::Threads)


